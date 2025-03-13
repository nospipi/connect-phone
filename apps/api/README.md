heroku login
heroku git:remote -a connect-phone
heroku buildpacks:clear
heroku buildpacks:set https://github.com/lstoll/heroku-buildpack-monorepo
heroku config:set APP_BASE=apps/api
heroku buildpacks:add heroku/nodejs
git push heroku master:main