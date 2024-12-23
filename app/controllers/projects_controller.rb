class ProjectsController < ApplicationController
  before_action :set_post, only: [ :show ]

  def new
    @project = Project.new
  end

  def create
    @project = Project.new(project_params)
    @project.user = current_user

    if @project.save
      redirect_to @project
    else
      render :new
    end
  end

  def show
  end

  private
    def project_params
      params.require(:project).permit(:name)
    end

    def set_post
      @project = Project.find(params[:id])
    end
end
