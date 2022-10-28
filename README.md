
# [pdfAssist](https://pdfassist.cyclic.app/)
This full stack web application allows users to create documents ready for filing in FL and TX courts by simply filing out a form. Users can create accounts, manage their own customer lists and templates, and generate FL summonses or TX citation requests.

Check out the app [here](https://pdfassist.cyclic.app/).
Test login:
Email: test1@test1.com
PW: 12345678

![pdfAssist landing page](/public/img/landingCrop.png)

## How It's Made:
#### Tech Stack:
<p>
  <img src="https://img.shields.io/static/v1?label=|&message=HTML5&labelColor=42494F&color=213a59&style=for-the-badge&logo=HTML5&logo-color=white"/>
  <img src="https://img.shields.io/static/v1?label=|&message=CSS3&labelColor=42494F&color=213a59&style=for-the-badge&logo=CSS3&logoColor=2862e9&logo-color=white"/>
  <img src="https://img.shields.io/static/v1?label=|&message=JavaScript&labelColor=42494F&color=3d607e&style=for-the-badge&logo=JavaScript&logo-color=white"/>
  <img src="https://img.shields.io/static/v1?label=|&message=Express&labelColor=42494F&color=3d607e&style=for-the-badge&logo=Express&logo-color=white"/>    
  <img src="https://img.shields.io/static/v1?label=|&message=Node.js&labelColor=42494F&color=3d607e&style=for-the-badge&logo=Node.js&logo-color=white"/> 
  <img src="https://img.shields.io/static/v1?label=|&message=MongoDB&labelColor=42494F&color=213a59&style=for-the-badge&logo=MongoDB&logo-color=white"/> 
</p>

#### Packages/Dependencies Used:
- bcrypt
- bootstrap
- cloudinary
- connect-mongo
- cors
- dotenv
- ejs
- express
- express-flash
- express-session
- jquery
- method-override
- mongodb
- mongoose
- morgan
- multer
- nodemon
- passport
- passport-local
- pdf-lib
- validator

This app was built following MVC architecture. The front end was built using EJS for HTML templating, Bootstrap and CSS for styling, and JavaScript with a tiny bit of jQuery for functionality. The back end was built with Node.js, Express, MongoDB, and Mongoose. Passport and Validator enable users to create accounts and Bcrypt is used to hash user passwords so they remain secure when stored in MongoDB. Multer enables the user to upload templates from their local computer and Cloudinary is used for template storage and delivery. Pdf-lib is used to fill out templates and return pdfs for the user to view and download. Express-session using cookies to enable the user to return to where they left off in the app if they leave without logging out. Express-flash displays error messages to the user when during log in and sign up. Morgan is used to log requests and other information for use when debugging.

## Optimizations:
In the future, I would like to build out the following features:
- Generate multiple templates by uploading a .xlsx file containing the necessary information
- Template selection when generating a pdf will be automatically filtered to only show a user's templates when if they make that selection in their settings
- Preview a template from the templates dashboard
- Build out a court database so clerks, court addresses, and document return methods can be auto-selected so the user only has to select the county
- Expand template database to include FL Orders to Appoint Process Server and FL Writs of Garnishment
- Limit the number of templates shown on the template page via pagination
- Preview templates shown on on the template page
- Display the last modified/upload date for each template on the templates page
- Bug: On the TX citation generation page, the doc return method has to be unselected and re-selected before it works.

## Lessons Learned:
When I started this app, I had wanted users to be able to edit/create templates using a built-in text editor. The [first iteration of this project](https://github.com/XiaoLGrant/fl-legal-doc-generator) used the TinyMCE editor, and I struggled to get the data to save in MongoDB so that it could be rendered in a way the user could print off a pdf of the document later and ultimately ended up relying on TinyMCE's built-in templating functions. However, I quickly realized that selecting a specific template from TinyMCE when there were a large number of templates to select from resulted in a difficult user experience. So, I changed my approach so that the template database relied on the user to create and upload pdf forms that could be filled out with pdf-lib.

This was also my first experience using Bootstrap to for layout design and styling. After getting a handle on the syntax, it made designing and styling the app so much simpler and easier to than if I had coded everything out from scratch.

## Additional Screenshots
![pdfAssist user dashboard](/public/img/accountOverview.png)
![pdfAssist's form to generate a FL summons](/public/img/generateFLForm.png)
![preview of a FL Summons generated by pdfAssist](/public/img/generateFLDoc.png)