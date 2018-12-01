/**
     * The Project ID of your Google Cloud Storage Project.
     */
    var PROJECT = 'REDACTED';

    /**
     * Enter a client ID for a web application from the Google Developers
     * Console on the "APIs & auth", "Credentials" page.
     * In your Developers Console project add a JavaScript origin
     * that corresponds to the domain from where you will be running the
     * script. For more info see:
     * https://developers.google.com/console/help/new/#generatingoauth2
     */
    var clientId = 'REDACTED';

   /**
    * Enter the API key from the Google Developers Console, by following these
    * steps:
    * 1) Visit https://cloud.google.com/console and select your project
    * 2) Click on "APIs & auth" in the left column and then click “Credentials”
    * 3) Find section "Public API Access" and use the "API key." If sample is
    * being run on localhost then delete all "Referers" and save. Setting
    * should display "Any referer allowed." For more info see:
    * https://developers.google.com/console/help/new/#generatingdevkeys
    */
    var apiKey = 'REDACTED';

    /**
     * To enter one or more authentication scopes, refer to the documentation
     * for the API.
     */
    var scopes = 'https://www.googleapis.com/auth/devstorage.full_control';

    /**
     * Constants for request parameters. Fill these values in with your custom
     * information.
     */
    var API_VERSION = 'v1';

    /**
     * Enter a unique bucket name to create a new bucket. The guidelines for
     * bucket naming can be found here:
     * https://developers.google.com/storage/docs/bucketnaming
     */
    var BUCKET = 'REDACTED';

    /**
     * The name of the object inserted via insertObject method.
     */
    var object = "";

    /**
     * Get this value from the Developers Console. Click on the
     * “Cloud Storage” service in the Left column and then select
     * “Project Dashboard”. Use one of the Google Cloud Storage group IDs
     * listed and combine with the prefix “group-” to get a string
     * like the example below.
     */
    var GROUP =
    'REDACTED';

    /**
     * Valid values are user-userId, user-email, group-groupId, group-email,
     * allUsers, allAuthenticatedUsers
     */
    var ENTITY = 'allUsers';

    /**
     * Valid values are READER, OWNER
     */
    var ROLE = 'READER';

    /**
     * Valid values are READER, OWNER
     */
    var ROLE_OBJECT = 'READER';

    /**
     * A list of example calls to the Google Cloud Storage JavaScript client
     * library, as well as associated explanations of each call.
     */
    var listApiRequestExplanations = {
      'listBuckets': 'This API call queries the Google Cloud Storage API ' +
        'for a list of buckets in your project, and returns the result as ' +
        'a list of Google Cloud Storage buckets.',

      'listObjects': 'This API call queries the Google Cloud Storage API ' +
        'for a list of objects in your bucket, and returns the result as ' +
        'a list of Google Cloud Storage objects.',

      'listBucketsAccessControls': 'This API call queries the Google Cloud ' +
        'Storage API for the list of access control lists on buckets in your ' +
        'project and returns the result as a list of Google Cloud Storage ' +
        'Access Control Lists.',

      'listObjectsAccessControls': 'This API call queries the Google Cloud ' +
        'Storage API for the list of access control lists on objects in your ' +
        'bucket and returns the result as a list of Google Cloud Storage ' +
        'Access Control Lists.',

      'getBucket': 'This API call queries the Google Cloud Storage API ' +
        'for a bucket in your project, and returns the result as a ' +
        'Google Cloud Storage bucket.',

      'getBucketAccessControls': 'This API call queries the Google Cloud ' +
        'Storage API for the access control list on a specific bucket ' +
        'and returns the result as a Google Cloud Storage Access Control List.',

      'getObjectAccessControls': 'This API call queries the Google Cloud ' +
        'Storage API for the access control list on a specific object ' +
        'and returns the result as a Google Cloud Storage Access Control List.',

      'insertBucket': 'This API call uses the Google Cloud Storage API ' +
        'to insert a bucket into your project.',

      'insertObject': 'This API call uses the Google Cloud Storage API ' +
        'to insert an object into your bucket.',

      'insertBucketAccessControls': 'This API uses the Google Cloud ' +
        'Storage API to insert an access control list on a specific bucket ' +
        'and returns the result as a Google Cloud Storage Access Control List.',

      'insertObjectAccessControls': 'This API uses the Google Cloud ' +
        'Storage API to insert an access control list on a specific object ' +
        'and returns the result as a Google Cloud Storage Access Control List.',

      'deleteBucket': 'This API uses the Google Cloud Storage API to delete ' +
        'an empty bucket and returns an empty response to indicate success.',

      'deleteObject': 'This API uses the Google Cloud Storage API to delete ' +
        'an object and returns an empty response to indicate success.'
    };

    /**
     * Google Cloud Storage API request to retrieve the list of buckets in
     * your Google Cloud Storage project.
     */
    function listBuckets() {
      var request = gapi.client.storage.buckets.list({
        'project': PROJECT
      });
      request.execute(function(resp) {
        console.log(resp)
      });
      //executeRequest(request, 'listBuckets');
      console.log("hi")
    }

    /**
     * Google Cloud Storage API request to retrieve the list of objects in
     * your Google Cloud Storage project.
     */
    function listObjects() {
      var request = gapi.client.storage.objects.list({
        'bucket': BUCKET
      });
      request.execute(function(resp) {
        console.log(resp);
      });
      //executeRequest(request, 'listObjects');
    }

    /**
     * Google Cloud Storage API request to retrieve the access control list on
     * a bucket in your Google Cloud Storage project.
     */
    function listBucketsAccessControls() {
      var request = gapi.client.storage.bucketAccessControls.list({
          'bucket': BUCKET
      });
      executeRequest(request, 'listBucketsAccessControls');
    }

    /**
     * Google Cloud Storage API request to retrieve the access control list on
     * an object in your Google Cloud Storage project.
     */
    function listObjectsAccessControls() {
      var request = gapi.client.storage.objectAccessControls.list({
          'bucket': BUCKET,
          'object': object
      });
      executeRequest(request, 'listObjectsAccessControls');
    }

    /**
     * Google Cloud Storage API request to retrieve a bucket in
     * your Google Cloud Storage project.
     */
    function getBucket() {
      var request = gapi.client.storage.buckets.get({
        'bucket': BUCKET
      });
      //executeRequest(request, 'getBucket');
      request.execute(function(resp) {
        console.log(resp)

      })
    }

    /**
     * Google Cloud Storage API request to retrieve a bucket's Access Control
     * List in your Google Cloud Storage project.
     */
    function getBucketAccessControls() {
      var request = gapi.client.storage.bucketAccessControls.get({
        'bucket': BUCKET,
        'entity': GROUP
      });
      executeRequest(request, 'getBucketAccessControls');
    }

    /**
     * Google Cloud Storage API request to retrieve an object's Access Control
     * List in your Google Cloud Storage project.
     */
    function getObjectAccessControls() {
      var request = gapi.client.storage.objectAccessControls.get({
        'bucket': BUCKET,
        'object': object,
        'entity': GROUP
      });
      executeRequest(request, 'getObjectAccessControls');
    }

    /**
     * Google Cloud Storage API request to insert a bucket into
     * your Google Cloud Storage project.
     */
    function insertBucket() {
      resource = {
        'name': BUCKET
      };

      var request = gapi.client.storage.buckets.insert({
          'project': PROJECT,
          'resource': resource
      });
      executeRequest(request, 'insertBucket');
    }

    /**
     * Google Cloud Storage API request to insert an object into
     * your Google Cloud Storage bucket.
     */
    function insertObject(event) {
      try{
        var fileData = event.target.files[0];
      }
      catch(e) {
        //'Insert Object' selected from the API Commands select list
        //Display insert object button and then exit function
        filePicker.style.display = 'block';
        return;
      }
      const boundary = '-------314159265358979323846';
      const delimiter = "\r\n--" + boundary + "\r\n";
      const close_delim = "\r\n--" + boundary + "--";

      var reader = new FileReader();
      reader.readAsBinaryString(fileData);
      reader.onload = function(e) {
        var contentType = fileData.type || 'application/octet-stream';
        var metadata = {
          'name': fileData.name,
          'mimeType': contentType
        };

        var base64Data = btoa(reader.result);
        var multipartRequestBody =
          delimiter +
          'Content-Type: application/json\r\n\r\n' +
          JSON.stringify(metadata) +
          delimiter +
          'Content-Type: ' + contentType + '\r\n' +
          'Content-Transfer-Encoding: base64\r\n' +
          '\r\n' +
          base64Data +
          close_delim;

        //Note: gapi.client.storage.objects.insert() can only insert
        //small objects (under 64k) so to support larger file sizes
        //we're using the generic HTTP request method gapi.client.request()
        var request = gapi.client.request({
          'path': '/upload/storage/' + API_VERSION + '/b/' + BUCKET + '/o',
          'method': 'POST',
          'params': {'uploadType': 'multipart'},
          'headers': {
            'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
          },
          'body': multipartRequestBody});
          //Remove the current API result entry in the main-content div
          listChildren = document.getElementById('main-content').childNodes;
          if (listChildren.length > 1) {
            listChildren[1].parentNode.removeChild(listChildren[1]);
          }
        try{
          //Execute the insert object request
          executeRequest(request, 'insertObject');
          //Store the name of the inserted object
          object = fileData.name;
        }
        catch(e) {
          alert('An error has occurred: ' + e.message);
        }
      }
    }

    /**
     * Google Cloud Storage API request to insert an Access Control List into
     * your Google Cloud Storage bucket.
     */
    function insertBucketAccessControls() {
      resource = {
        'entity': ENTITY,
        'role': ROLE
      };

      var request = gapi.client.storage.bucketAccessControls.insert({
          'bucket': BUCKET,
          'resource': resource
      });
      executeRequest(request, 'insertBucketAccessControls');
    }

    /**
     * Google Cloud Storage API request to insert an Access Control List into
     * your Google Cloud Storage object.
     */
    function insertObjectAccessControls() {
      resource = {
        'entity': ENTITY,
        'role': ROLE_OBJECT
      };

      var request = gapi.client.storage.objectAccessControls.insert({
          'bucket': BUCKET,
          'object': object,
          'resource': resource
      });
      executeRequest(request, 'insertObjectAccessControls');
    }

    /**
     * Google Cloud Storage API request to delete a Google Cloud Storage bucket.
     */
    function deleteBucket() {
      var request = gapi.client.storage.buckets.delete({
          'bucket': BUCKET
      });
      executeRequest(request, 'deleteBucket');
    }

    /**
     * Google Cloud Storage API request to delete a Google Cloud Storage object.
     */
    function deleteObject() {
      var request = gapi.client.storage.objects.delete({
          'bucket': BUCKET,
          'object': object
      });
      executeRequest(request, 'deleteObject');
    }

    /**
     * Set required API keys and check authentication status.
     */
    function handleClientLoad() {
      gapi.client.setApiKey(apiKey);
      window.setTimeout(checkAuth, 1);
    }

    /**
     * Authorize Google Cloud Storage API.
     */
    function checkAuth() {
      gapi.auth.authorize({
        client_id: clientId,
        scope: scopes,
        immediate: true
      }, handleAuthResult);
    }

    /**
     * Handle authorization.
     */
    function handleAuthResult(authResult) {
      var authorizeButton = document.getElementById('authorize-button');
      if (authResult && !authResult.error) {
        authorizeButton.style.visibility = 'hidden';
        initializeApi();
      } else {
        authorizeButton.style.visibility = '';
        authorizeButton.onclick = handleAuthClick;
      }
    }

    /**
     * Handle authorization click event.
     */
    function handleAuthClick(event) {
      gapi.auth.authorize({
        client_id: clientId,
        scope: scopes,
        immediate: false
      }, handleAuthResult);
      return false;
    }

    function returnFileURL(uniqueIdentifier) {
      var request = gapi.client.storage.objects.list({
        'bucket': BUCKET
      });
      request.execute(function(resp) {
        var vids = resp['items']
        for (i = 0 ; i < vids.length; i++){
          // if(vids[i]['name'] == uniqueIdentifier){
          //   console.log(vids[i]['mediaLink']);
          //   return vids[i]['mediaLink'];
          // }
          console.log(vids[i]);
        }
      });
    }

    /**
     * Load the Google Cloud Storage API.
     */
    function initializeApi() {
      gapi.client.load('storage', API_VERSION);
    }

    /**
     * Driver for sample application.
     */
    $(window)
      .bind('load', function() {
        handleClientLoad();
    });
