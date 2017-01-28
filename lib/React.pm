package React;
use 5.008001;
use strict;
use warnings;
use JSON::XS;

our $VERSION = "0.00000001";

sub new {
  my $class = shift;
  my $connection = React::ServerConnectionPool->new;
  bless {
    connection => $connection,
  }, $class;
}

sub render {
  my ($self, $component_name, %options) = @_;
  my $domNodeId = $options{'domNodeId'} || '';
  my %props = $options{'props'} || {};
  my $props_str = encode_json(\%props);

  my $result_json = $self->connection->eval_js(qq|
    (function() {
      return PerlReact.serverRender({
        name: "$component_name",
        domNodeId: "$domNodeId",
        props: $props_str,
      });
    })();
  |);

  my %result = decode_json($result_json);
  my $html = $result{'html'};
  my $has_errors = $result{'has_errors'};

  if ($has_errors) {

  }
  else {
    return $html;
  }
}

1;
__END__

=encoding utf-8

=head1 NAME

React - React server-side rendering for Perl with Node.js

=head1 SYNOPSIS

    use React;

=head1 DESCRIPTION

PerlReact is React server-side rendering library for Perl.

=head1 LICENSE

Copyright (C) nukosuke.

This library is free software; you can redistribute it and/or modify
it under the MIT license.

=head1 AUTHOR

nukosuke E<lt>nukosuke@cpan.orgE<gt>

=cut
