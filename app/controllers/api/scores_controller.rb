class Api::ScoresController < ApplicationController

  def index
    @scores = Score.all
    @scores = @scores.sort { |a, b| a.num <=> b.num }.reverse
    clean_up
  end

  def create
    if level_score
      @score = Score.new(score_params)
      @score.save!
      @scores = Score.all
      @scores = @scores.sort { |a, b| a.num <=> b.num }.reverse
      clean_up
    end
  end

  def clean_up
    @scores.each_with_index do |score, idx|
      if idx > 9
        score.destroy!
      end
    end
  end

  def level_score
    if score_params[:score].to_i > 1820
        return false
    elsif score_params[:score].to_i >= 1428
      score_params[:level].to_i == 5
    elsif score_params[:score].to_i >= 1050
      score_params[:level].to_i == 4
    elsif score_params[:score].to_i >= 686
      score_params[:level].to_i == 3
    elsif score_params[:score].to_i >= 336
      score_params[:level].tp_i == 2
    else
      true
    end
  end

  private
  def score_params
    params.require(:score).permit(:name, :num, :level)
  end

end
