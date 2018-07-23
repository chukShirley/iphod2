use Mix.Config

# In this file, we keep production configuration that
# you'll likely want to automate and keep away from
# your version control system.
#
# You should document the content of this
# file or create a script for recreating it, since it's
# kept out of version control and might be hard to recover
# or recreate for your teammates (or yourself later on).
config :iphod2, Iphod2Web.Endpoint,
  secret_key_base: "D/n6smSUnhMb6xsLrNFVSNQumm10wSbDm1JWgohtFIOaUpM25I+tX/yUVnHYgmx0"

# Configure your database
config :iphod2, Iphod2.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "iphod2_prod",
  pool_size: 15
