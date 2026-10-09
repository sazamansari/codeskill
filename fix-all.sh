# Fix NGINX
cat << 'NGINX' > /etc/nginx/conf.d/codeskill.conf
server {
    listen 80;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    location /api/ {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host \$host;
    }
    
    location /socket.io/ {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host \$host;
    }
}
NGINX
rm -f /etc/nginx/conf.d/default.conf
dnf install -y nginx
systemctl enable nginx
systemctl restart nginx

# Fix PM2
sudo -u ec2-user -i bash -c "cd /opt/codeskill/backend-nestjs && npm install --omit=dev --legacy-peer-deps && pm2 restart codeskill-backend"
