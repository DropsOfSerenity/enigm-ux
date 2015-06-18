class WelcomeController < ApplicationController
  def index
    @categories = Category.all.as_json(include: [:items])
  end
end
