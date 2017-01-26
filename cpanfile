requires 'perl', '5.008001';
requires 'JSON::XS', '> 3.00';

on 'test' => sub {
    requires 'Test::More', '0.98';
};
