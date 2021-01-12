call build.bat %*

SET TARGET_ENV=%1

If "%TARGET_ENV%"=="dev" (SET S3="s3://financial-planner-3-dev"
) ELSE If "%TARGET_ENV%"=="prod" SET S3="s3://financial-planner-3"

If NOT "%TARGET_ENV%"=="localhost"  (
  aws s3 rm --recursive %S3%
  aws s3 cp --recursive build %S3%
  )