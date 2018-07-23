# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :iphod2,
  ecto_repos: [Iphod2.Repo]

# Configures the endpoint
config :iphod2, Iphod2Web.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "eiZwn3b92uujRex+tHz3jLO5JKzLHbxOD8rY1T9D5R1aVNEbMc8BgSuRmK9DtXVA",
  render_errors: [view: Iphod2Web.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Iphod2.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:user_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
