import React, { createRef, useEffect } from 'react';
import TextFile from './TextFile';

import { config } from './AWSConfig';
import S3 from 'react-aws-s3';

import { useScreenshot } from 'use-react-screenshot';

const ImageUpload = () => {
  const ref = createRef(null);
  const [image, takeScreenShot] = useScreenshot();

  const getImage = () => takeScreenShot(ref.current);

  function base64ToBlob(base64, mime) {
    mime = mime || '';
    var sliceSize = 1024;
    var byteChars = window.atob(base64);
    var byteArrays = [];

    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
      var slice = byteChars.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mime });
  }

  useEffect(() => {
    if (image) {
      var jpegFile64 = image.replace(/^data:image\/(png|jpeg);base64,/, '');
      var jpegBlob = base64ToBlob(jpegFile64, 'image/jpeg');
      console.log('@jpg', jpegBlob);
      const date = new Date().toISOString().slice(0, 19);
      const ReactS3Client = new S3(config);
      ReactS3Client.uploadFile(jpegBlob, `${date}-image-screenshot.png`).then((data) => {
        if (data.status === 204) {
          console.log('successfully uploaded the image on Amazon S3!');
        } else {
          console.log('Image upload fail!');
        }
      });
    }
  });

  return (
    <div>
      <div>
        <button style={{ marginBottom: '10px' }} onClick={getImage}>
          Screenshot and save
        </button>
      </div>
      <img id="myimage" width={100} src={image} alt={'ScreenShot'} />

      <div
        ref={ref}
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          marginTop: '20px',
        }}
      >
        <TextFile />
      </div>
    </div>
  );
};

export default ImageUpload;
