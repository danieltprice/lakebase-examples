// Connect to Postgres (e.g. Lakebase) on Cloudflare Workers.
// Set POSTGRES_URL to a connection string (for Lakebase, use a short-lived token from the Databricks API).
// Set LAKEBASE_HOST and optionally LAKEBASE_PORT for the socket connection.
use worker::{postgres_tls::PassthroughTls, *};

#[event(fetch)]
async fn main(_req: Request, env: Env, _ctx: Context) -> anyhow::Result<Response> {
    let postgres_url = env.var("POSTGRES_URL")?.to_string();
    let config = postgres_url.parse::<tokio_postgres::Config>()?;

    let host = env.var("LAKEBASE_HOST").map(|v| v.to_string()).or_else(|_| env.var("POSTGRES_HOST")).map(|v| v.to_string()).unwrap_or_else(|_| "localhost".to_string());
    let port: u16 = env.var("LAKEBASE_PORT").or_else(|_| env.var("POSTGRES_PORT")).map(|v| v.to_string()).unwrap_or_else(|_| "5432".to_string()).parse().unwrap_or(5432);

    let socket = Socket::builder()
        .secure_transport(SecureTransport::StartTls)
        .connect(host.as_str(), port)?;

    let (client, connection) = config.connect_raw(socket, PassthroughTls).await?;

    wasm_bindgen_futures::spawn_local(async move {
        if let Err(error) = connection.await {
            console_log!("connection error: {:?}", error);
        }
    });

    let rows = client.query("SELECT 1", &[]).await.unwrap();
    let value = rows[0].get::<_, i32>(0);
    console_log!("Value: {}", value);

    Ok(Response::ok(format!("{:?}", rows))?)
}
