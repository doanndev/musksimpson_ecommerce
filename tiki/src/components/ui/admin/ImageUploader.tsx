'use client';

import { storage } from '@/config';
import { CloseRounded, FileUploadOutlined } from '@mui/icons-material';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface ImageUploaderProps {
  onImagesChange: (urls: string[]) => void;
}

interface ImageFile {
  file: File;
  name: string;
  imageUrl: string;
  size: string;
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};

export default function ImageUploader({ onImagesChange }: ImageUploaderProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).map((file) => ({
      file,
      name: file.name,
      imageUrl: URL.createObjectURL(file),
      size: formatFileSize(file.size),
    }));
    setImages(files);
  };

  const handleUploadImage = async () => {
    if (images.length === 0) return;
    setUploading(true);
    const updatedImageList: string[] = [];

    try {
      for (const { file, name } of images) {
        const imageRef = ref(storage, `images/${name}-${uuidv4()}`);
        const snapshot = await uploadBytes(imageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        updatedImageList.push(url);
      }
      onImagesChange(updatedImageList);
      setImages([]);
    } catch (error) {
      alert('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImageItem = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleRemoveAllImages = () => {
    setImages([]);
  };

  return (
    <Stack gap={2}>
      <Box
        sx={{
          height: 150,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'grey.100',
          borderRadius: '16px',
          border: '1px dashed grey',
        }}
      >
        <Button
          variant='text'
          component='label'
          sx={{ width: '100%', height: '100%', borderRadius: '16px' }}
          disabled={uploading}
        >
          <Stack direction='row' alignItems='center' gap={2}>
            <Box
              sx={{
                borderRadius: '50%',
                width: 60,
                height: 60,
                bgcolor: 'rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileUploadOutlined sx={{ fontSize: 32 }} />
            </Box>
            <Stack>
              <Typography variant='body1' fontWeight='600'>
                Click to upload
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                (SVG, JPG, PNG, or GIF, maximum 900x400)
              </Typography>
            </Stack>
          </Stack>
          <input type='file' multiple hidden accept='image/*' onChange={handleChangeFile} />
        </Button>
      </Box>

      {images.map(({ name, size, imageUrl }, index) => (
        <Stack
          key={index}
          direction='row'
          borderRadius='12px'
          alignItems='center'
          justifyContent='space-between'
          border='1px solid'
          borderColor='grey.200'
          p={2}
        >
          <Stack direction='row' gap={2}>
            <img src={imageUrl} alt={name} width={70} height={50} style={{ objectFit: 'cover', borderRadius: '8px' }} />
            <Stack>
              <Typography variant='body2' fontWeight={600}>
                {name}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {size}
              </Typography>
            </Stack>
          </Stack>
          <IconButton onClick={() => handleRemoveImageItem(index)} disabled={uploading}>
            <CloseRounded />
          </IconButton>
        </Stack>
      ))}

      {images.length > 0 && (
        <Stack direction='row' justifyContent='end' gap={2}>
          <Button color='inherit' onClick={handleRemoveAllImages} disabled={uploading}>
            Remove All
          </Button>
          <Button variant='contained' color='primary' onClick={handleUploadImage} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
