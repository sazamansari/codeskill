resource "aws_launch_template" "app" {
  name_prefix   = "${var.name_prefix}-lt"
  image_id      = var.ami_id
  instance_type = var.instance_type

  vpc_security_group_ids = [var.app_security_group_id]

  iam_instance_profile {
    name = var.iam_instance_profile_name
  }

  user_data = base64encode(<<EOF
#!/bin/bash
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

echo "Starting CodeSkill EC2 initialization..."

# Update and install dependencies
apt-get update -y
apt-get install -y curl unzip awscli nginx

# Install Node.js (v20)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install PM2 globally
npm install -g pm2

# Prepare app directory
APP_DIR="/opt/codeskill"
mkdir -p $APP_DIR
cd $APP_DIR

# Download latest build from S3 using the IAM Instance Profile attached to this EC2 instance
# Note: The S3 bucket was created in the Terraform S3 module
aws s3 cp s3://${var.name_prefix}-files-reports/releases/latest.zip .

# Unzip and set permissions
unzip latest.zip
chown -R ubuntu:ubuntu $APP_DIR

# Create Nginx reverse proxy configuration
cat << 'NGINX' > /etc/nginx/sites-available/default
server {
    listen 80;
    
    # Next.js frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $${http_upgrade};
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $${host};
        proxy_cache_bypass $${http_upgrade};
    }

    # NestJS API and WebSockets
    location /api/ {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $${http_upgrade};
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $${host};
    }
    
    location /socket.io/ {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $${http_upgrade};
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $${host};
    }
}
NGINX

systemctl restart nginx

# Install production dependencies and start apps as the ubuntu user
sudo -u ubuntu -i << 'EOSUDO'
cd /opt/codeskill
npm ci --prefix backend-nestjs --omit=dev
npm ci --prefix frontend-v2 --omit=dev

pm2 start dist/main.js --name "codeskill-backend" --prefix backend-nestjs
cd frontend-v2 && pm2 start npm --name "codeskill-frontend" -- run start

pm2 save
EOSUDO

# Setup PM2 to start on boot
env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu

echo "Initialization complete!"
EOF
  )

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_autoscaling_group" "app" {
  name                = "${var.name_prefix}-asg"
  vpc_zone_identifier = var.private_app_subnet_ids
  target_group_arns   = [var.target_group_arn]

  min_size         = var.min_size
  max_size         = var.max_size
  desired_capacity = var.desired_capacity

  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "${var.name_prefix}-app-instance"
    propagate_at_launch = true
  }
}

resource "aws_autoscaling_policy" "cpu" {
  name                   = "${var.name_prefix}-cpu-policy"
  policy_type            = "TargetTrackingScaling"
  autoscaling_group_name = aws_autoscaling_group.app.name

  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }
    target_value = 60.0
  }
}

resource "aws_autoscaling_policy" "alb_requests" {
  name                   = "${var.name_prefix}-alb-requests-policy"
  policy_type            = "TargetTrackingScaling"
  autoscaling_group_name = aws_autoscaling_group.app.name

  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ALBRequestCountPerTarget"
      resource_label         = "${split("/", var.target_group_arn)[1]}/${split("/", var.target_group_arn)[2]}/${split("/", var.target_group_arn)[3]}"
    }
    target_value = 1000.0
  }
}
