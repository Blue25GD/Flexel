module ProjectsHelper
  def generate_project_name
    nouns = "app/assets/other/english-nouns.txt"
    adjectives = "app/assets/other/english-adjectives.txt"

    noun = File.readlines(nouns).sample.strip
    adjective = File.readlines(adjectives).sample.strip

    "#{adjective.downcase}-#{noun.downcase}"
  end
end
