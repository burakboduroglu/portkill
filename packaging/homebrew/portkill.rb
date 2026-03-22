# Homebrew formula for portkill (npm tarball).
# Copy into a tap repository as Formula/portkill.rb, e.g.:
#   brew tap burakboduroglu/portkill https://github.com/burakboduroglu/homebrew-portkill
#
# After each npm release, update `url` version, `sha256`, and `version`.
#   curl -sL "https://registry.npmjs.org/portkill/-/portkill-0.4.0.tgz" | shasum -a 256
#
# frozen_string_literal: true

require "language/node"

class Portkill < Formula
  desc "Kill processes listening on specified TCP ports"
  homepage "https://github.com/burakboduroglu/portkill"
  url "https://registry.npmjs.org/portkill/-/portkill-0.4.0.tgz"
  sha256 "a84fed2b961f867fb93eb177b90f2a179819da60be4908c771752ea3a660d589"
  license "MIT"

  depends_on "node"

  def install
    system "npm", "install", *Language::Node.std_npm_install_args(libexec)
    bin.install_symlink Dir["#{libexec}/bin/*"]
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/portkill --version")
  end
end
