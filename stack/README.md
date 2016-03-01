# GEOGLAM Map CloudFormation Stack, or, how to deploy GEOGLAM Map
# This is based on National Map CloudFormation Stack.

## Prerequisites; skip if already installed.

### awscli, recent version.

```sh
pip install awscli
```

### aws credentials

You must have an `awscli` configuration profile (in `~/.aws/config`) with your credentials. e.g.

```
[profile geoglam-nm]
aws_access_key_id=YOUR_ACCESS_KEY
aws_secret_access_key=YOUR_SECRET_ACCESS_KEY
```

## Release process

1. Quick sanity check on local instance:

```
git checkout master
git pull
npm install && gulp build watch
```

2. Update changelog.md with release notes.

3. Tag:

```
git tag -a 2016-03-01 master
git push origin 2016-03-01
```

4. Build package:

```
./make_package
```

### Release tarball on S3

The new release tarball needs to be copied to the `geoglam-apps` S3 bucket, e.g.

```
aws --profile=geoglam-nm s3 cp target/geoglam-nm-master-2016-03-01.tar.gz s3://geoglam-apps/
```

## Deployment Process

### Update User Data

Update the `user-data` file as required. Typically you just need to update all occurences of the release version, e.g.

```
geoglam-nm-master-2016-03-01 -> geoglam-nm-master-2016-12-25
```

### Check script params

In stack, make sure arguments are correct. For example, your ssh key should be specified.

### Create Stack

Create a new stack:

```
./stack create gg-2016-03-01
```

This process takes about 5 minutes but it can take a further 15 minutes for the DNS to propagate.

### Test stack

Each stack is automatically assigned its own URL based on the name of the stack. e.g.

```
http://gg-2016-01-15.map.geo-rapp.org/
```

### Update DNS alias

Once you're satisfied the release is working, change the staging environment DNS record to point to the new stack using the Route 53 Console.

```
map.geo-rapp.org value ALIAS http://gg-2016-01-15.map.geo-rapp.org/
```

