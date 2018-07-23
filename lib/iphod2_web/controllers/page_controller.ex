defmodule Iphod2Web.PageController do
  use Iphod2Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
