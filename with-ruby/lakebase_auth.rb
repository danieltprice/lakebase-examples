# Fetches short-lived DB token from Databricks and returns a PostgreSQL connection string.
require 'net/http'
require 'json'
require 'base64'
require 'cgi'

def fetch_lakebase_connection_string
  host = ENV['DATABRICKS_HOST']
  client_id = ENV['DATABRICKS_CLIENT_ID']
  client_secret = ENV['DATABRICKS_CLIENT_SECRET']
  endpoint = ENV['LAKEBASE_ENDPOINT']
  db_host = ENV['LAKEBASE_HOST']
  db_port = ENV['LAKEBASE_PORT'] || '5432'
  db_name = ENV['LAKEBASE_DATABASE'] || 'databricks_postgres'

  raise 'Set DATABRICKS_HOST, DATABRICKS_CLIENT_ID, DATABRICKS_CLIENT_SECRET, LAKEBASE_ENDPOINT, LAKEBASE_HOST' if [host, client_id, client_secret, endpoint, db_host].any?(&:nil?)

  # OIDC token
  uri_oidc = URI("https://#{host}/oidc/v1/token")
  req_oidc = Net::HTTP::Post.new(uri_oidc)
  req_oidc['Content-Type'] = 'application/x-www-form-urlencoded'
  req_oidc['Authorization'] = "Basic #{Base64.strict_encode64("#{client_id}:#{client_secret}")}"
  req_oidc.body = 'grant_type=client_credentials&scope=all-apis'
  res_oidc = Net::HTTP.start(uri_oidc.hostname, uri_oidc.port, use_ssl: true) { |http| http.request(req_oidc) }
  access_token = JSON.parse(res_oidc.body)['access_token']

  # DB credentials
  uri_db = URI("https://#{host}/api/2.0/postgres/credentials")
  req_db = Net::HTTP::Post.new(uri_db)
  req_db['Content-Type'] = 'application/json'
  req_db['Authorization'] = "Bearer #{access_token}"
  req_db.body = { endpoint: endpoint }.to_json
  res_db = Net::HTTP.start(uri_db.hostname, uri_db.port, use_ssl: true) { |http| http.request(req_db) }
  token = JSON.parse(res_db.body)['token']

  user = CGI.escape(client_id)
  pass = CGI.escape(token)
  "postgresql://#{user}:#{pass}@#{db_host}:#{db_port}/#{db_name}?sslmode=require"
end
