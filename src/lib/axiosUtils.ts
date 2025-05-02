// Utility function to create a simple Axios-like implementation
// This is used as a fallback when fetch and XMLHttpRequest fail

export const axiosLike = {
  post: async (url: string, data: any): Promise<any> => {
    console.log('Using axiosLike.post fallback');
    
    // Create a form element
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = url;
    form.enctype = 'application/x-www-form-urlencoded';
    form.style.display = 'none';
    
    // Add a hidden input for the JSON data
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'data';
    input.value = JSON.stringify(data);
    form.appendChild(input);
    
    // Add a hidden iframe to receive the response
    const iframe = document.createElement('iframe');
    iframe.name = 'response-frame';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    // Set the form target to the iframe
    form.target = 'response-frame';
    document.body.appendChild(form);
    
    // Create a promise to handle the response
    return new Promise((resolve, reject) => {
      iframe.onload = () => {
        try {
          // Try to get the response from the iframe
          const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
          if (!iframeDocument) {
            throw new Error('Could not access iframe document');
          }
          
          const responseText = iframeDocument.body.textContent || '';
          console.log('axiosLike received response:', responseText);
          
          try {
            const data = JSON.parse(responseText);
            resolve(data);
          } catch (parseError) {
            console.error('Error parsing response:', parseError);
            // If we can't parse JSON but got a response, consider it a success
            if (responseText.includes('success') || responseText.includes('created')) {
              resolve({ success: true, message: responseText });
            } else {
              reject(new Error(`Failed to parse response: ${responseText}`));
            }
          }
        } catch (error) {
          console.error('Error in iframe onload:', error);
          reject(error);
        } finally {
          // Clean up
          setTimeout(() => {
            document.body.removeChild(form);
            document.body.removeChild(iframe);
          }, 100);
        }
      };
      
      iframe.onerror = () => {
        console.error('Iframe error occurred');
        document.body.removeChild(form);
        document.body.removeChild(iframe);
        reject(new Error('Network error occurred'));
      };
      
      // Submit the form
      form.submit();
    });
  }
};
