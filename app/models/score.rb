class Score < ActiveRecord::Base
  validates :name, presence: true
  validates :num, presence: true
  validates :level, presence: true

end
