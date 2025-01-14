<h1> Caching-Proxy Server </h1>

This project is a simple URL caching proxy that allows users to fetch content from a given URL, cache the response, and display it in the browser. If the same URL is requested again, it will serve the cached response to save time. The cache is limited to a maximum number of entries to avoid excessive storage usage.

1. Clone the repository to your local machine. <br>
2. Run the following command to link the package globally:

```
npm link
```
3. Ensure that your execution policy is set to allow running scripts. If you are on Windows, you can check the current execution policy and update it if needed by running the following command in PowerShell as an administrator:
To set the policy to RemoteSigned, run:
```
Set-ExecutionPolicy RemoteSigned
```
<h3>Usage</h3>
After setting up the project and ensuring the prerequisites are met, you can run the script directly in any terminal using the following command:

```
<name-of-your-script> --url <url-to-fetch>
<name-of-your-script> --clear-cache
```
