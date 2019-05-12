sudo yum update -y
sudo yum install -y docker
sudo yum install -y git
sudo service docker start
sudo docker build https://github.com/yaylinda/my-website.git -t my-website
sudo docker run -d -p 4200:4200 my-website