// Preview Image after Upload
function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById('preview').src = e.target.result;
        document.getElementById('preview-container').style.display = 'block';
      }
      reader.readAsDataURL(file);
    }
  }
  
  // Handle Drag & Drop
  function handleDrop(event) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      document.getElementById('imageUpload').files = event.dataTransfer.files;
      previewImage({ target: { files: [file] } });
    }
  }
  
  // Enhance Image
  function enhanceImage() {
    const fileInput = document.getElementById('imageUpload');
    const file = fileInput.files[0];
  
    if (!file) {
      alert("Please upload an image first.");
      return;
    }
  
    // Show loading spinner
    document.getElementById('loadingSpinner').style.display = 'block';
    document.getElementById('enhanced-result').style.display = 'none';
  
    const formData = new FormData();
    formData.append("image", file);
  
    // Send image to backend
    fetch('/enhance', {
      method: 'POST',
      body: formData
    })
    .then(response => response.blob())
    .then(blob => {
      const imageUrl = URL.createObjectURL(blob);
      document.getElementById('enhancedImage').src = imageUrl;
      document.getElementById('enhanced-result').style.display = 'block';
  
      // ✅ Update Comparison and Download after enhancement
      updateComparison();
      updateDownloadLink();
    })
    .catch(error => {
      console.error('Enhancement failed:', error);
      alert("Something went wrong. Try again!");
    })
    .finally(() => {
      document.getElementById('loadingSpinner').style.display = 'none';
    });
  }
  
  // Toggle Comparison View
  function toggleCompare() {
    const comparisonArea = document.getElementById('comparisonArea');
    if (comparisonArea.style.display === 'none') {
      comparisonArea.style.display = 'flex';
      document.getElementById('compareToggleBtn').innerText = "Hide Comparison";
    } else {
      comparisonArea.style.display = 'none';
      document.getElementById('compareToggleBtn').innerText = "Show Comparison";
    }
  }
  
  // Update Comparison Section
  function updateComparison() {
    const originalImage = document.getElementById('preview').src;
    const enhancedImage = document.getElementById('enhancedImage').src;
  
    document.getElementById('originalImageCompare').src = originalImage;
    document.getElementById('enhancedImageCompare').src = enhancedImage;
    
    document.getElementById('compareSection').style.display = 'block';
  }
  
  // Update Download Link
  function updateDownloadLink() {
    const enhancedImageURL = document.getElementById('enhancedImage').src;
    const downloadBtn = document.getElementById('downloadBtn');
  
    downloadBtn.href = enhancedImageURL;
    document.getElementById('downloadSection').style.display = 'block';
  }
  