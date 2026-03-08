import asyncio
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

from lakebase_auth import get_connection_url

async def async_main() -> None:
    url = get_connection_url()
    engine = create_async_engine(url, echo=True)
    async with engine.connect() as conn:
        result = await conn.execute(text("select 'hello world'"))
        print(result.fetchall())
    await engine.dispose()

asyncio.run(async_main())
