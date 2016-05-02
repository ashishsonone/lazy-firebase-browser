# lazy-firebase-browser
Lazy way to browse your large firebase database (using firebase rest api)
As of now, its quite usable with all the necessary options for browsing the database one can think of (except edit/add a node which I think is not that important since this is just meant for browsing)

Features:
  - Load next level of data at a node(starts with root node)
  - Refresh the data at a node
  - Delete a node (with text input confirmation)
  - Change the firebase database to browse using query parameter 'target'
  - Open a node in Firebase website to see live updates to it
  
Advanced Features:
  - Enable authenticated access(for databases which have restricted read/write). For this, one must manually generate ciphered admin-level auth token using the 'cipher-auth-token-gen' tool provided with this project. This requires your Firebase secret(accessible from secrets tab on firebase dashboard). And then this token needs to be manually embedded into the page (specifically 'firebase_json_browser.js' file). After which it can be used by the end user only when correct 'key' query parameter is provided in the url. This 'key' is the one used to encrypt the token so that token is not publically visible and can be used only if one has the correct key to decipher it.