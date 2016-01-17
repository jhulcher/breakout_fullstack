json.array! @scores do |score|

  json.name score.name
  json.score score.num
  json.level score.level

end
