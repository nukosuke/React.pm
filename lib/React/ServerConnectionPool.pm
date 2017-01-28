package React::ServerConnectionPool;
use strict;
use warnings;
use IO::Socket::UNIX;

# rendering pool using Node.js
sub new {
  my $class = shift;
  my @pool = ();
  my $node_sock = './node.sock';
  my $size = 1; # default

  for (0..$size) {
    push @pool, create_js_context($node_sock);
  }

  bless {
    pool => \@pool,
  }, $class;
}


#
# class method
#

sub eval_js {
  my ($self, $js_code) = @_;
  my $c = pop @{$self->{pool}};
  my $buf;
  my $result_json = "";

  $c->send($js_code, 0);
  $c->recv($buf, 2**30-1);
  $result_json .= $buf;

  push @{$self->{pool}}, $c;
  $result_json;
}

sub create_js_context {
  my $SOCK_PATH = shift;
  my $client = IO::Socket::UNIX->new(
    Type => SOCK_STREAM(),
    Peer => $SOCK_PATH,
  );
}

1;
