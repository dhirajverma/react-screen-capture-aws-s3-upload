import { useRef } from 'react';
import S3 from 'react-aws-s3';
import { config } from './AWSConfig';

const AWSUpload = () => {
  const fileInput = useRef();
  const handleClick = (event) => {
    event.preventDefault();
    let file = fileInput.current.files[0];
    let newFileName = fileInput.current.files[0].name;
    console.log('@config', config);
    const ReactS3Client = new S3(config);
    ReactS3Client.uploadFile(file, newFileName).then((data) => {
      if (data.status === 204) {
        console.log('File uploaded on S3 bucket successfully');
      } else {
        console.log('Fail to upload--check the log and aws confiration in awsconfig file');
      }
    });
  };
  return (
    <>
      <form className="upload-steps" onSubmit={handleClick}>
        <label>
          upload file:
          <input type="file" ref={fileInput} />
        </label>
        <br />
        <button type="submit">Upload</button>
      </form>
    </>
  );
};

export default AWSUpload;
