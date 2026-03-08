require 'pg'
require 'dotenv'

Dotenv.load
require_relative 'lakebase_auth'

conn_string = fetch_lakebase_connection_string
conn = PG.connect(conn_string)
res = conn.exec("SELECT * FROM playing_with_neon;")

res.each do |row|
  puts "%s | %s | %s" % row.values_at('id', 'name', 'value')
end

conn.close
