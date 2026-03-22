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
  sha256 "21b2e1e76dbdff489455c6f34d8d44bc870124aa362d824f8cad7116b3382a7c"
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
