output "endpoint" {
  value = aws_elasticache_replication_group.main.configuration_endpoint_address
}
output "redis_cluster_id" {
  value = aws_elasticache_replication_group.main.id
}

