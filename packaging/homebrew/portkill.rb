# Homebrew formula for portkill (npm tarball).
# Copy into a tap repository as Formula/portkill.rb, e.g.:
#   brew tap burakboduroglu/portkill https://github.com/burakboduroglu/homebrew-portkill
#
# After each npm release, update `url` version, `sha256`, and `version`.
#   curl -sL "https://registry.npmjs.org/@burakboduroglu/portkill/-/portkill-0.4.1.tgz" | shasum -a 256
#
# frozen_string_literal: true

require "language/node"

class Portkill < Formula
  desc "Kill processes listening on specified TCP ports"
  homepage "https://github.com/burakboduroglu/portkill"
  url "https://registry.npmjs.org/@burakboduroglu/portkill/-/portkill-0.4.1.tgz"
  sha256 "f001c2dea4c753a9beaa539969ea6c9e26e78aaa75f2832789c66efc3de69f2d"
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
