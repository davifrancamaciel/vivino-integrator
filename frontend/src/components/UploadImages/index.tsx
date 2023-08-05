import React, { useEffect, useState } from 'react';
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PropTypes } from './interfaces';

function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const UploadImages: React.FC<PropTypes> = (props) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [maxCount, setMaxCount] = useState(1);

 

  useEffect(() => {
    props.maxCount && setMaxCount(props.maxCount);
  }, [props.maxCount]);

  const handleChange = async (file: any) => {
    var files = [];
    if (file.file.status == 'done') {
      for (let i = 0; i < file.fileList.length; i++) {
        const element = file.fileList[i];
        const preview = await getBase64(element.originFileObj);
        files.push({ ...element, preview, thumbUrl: preview });
      }
      props.setFileList(files);
    } else {
      props.setFileList(file.fileList);
    }    
  };

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    );
  };

  const handleCancel = () => setPreviewVisible(false);

  const customRequest = (file: any) => {
    setTimeout(() => {
      file.onSuccess('ok');
    }, 0);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div>
      <Upload
        listType="picture-card"
        fileList={props.fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        multiple={true}
        accept="image/x-png,image/jpeg,image/jeg"
        maxCount={props.maxCount}
        customRequest={customRequest}
      >
        {props.fileList.length < maxCount && uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt={previewTitle} style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default UploadImages;
