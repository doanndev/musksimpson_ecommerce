import { uploadAvatarRequest } from '@/api/user/request';
import { useAuthStore } from '@/stores/authStore';
import { Avatar, Box, Button, CircularProgress } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { toast } from 'sonner';

const AvatarUpload = ({ userId }: { userId: string }) => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const { token } = useAuthStore();

  // Mutation for uploading avatar to your backend
  const { mutate: uploadAvatar, isPending } = useMutation({
    mutationFn: (file: File) => uploadAvatarRequest({ userId, file }),
    onSuccess: () => {
      toast.success('Avatar updated successfully');
      setFile(null); // Clear file after successful upload
    },
    onError: (error) => {
      toast.error('Failed to update avatar');
      console.error(error);
    },
  });

  // Handle file selection and preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAvatar(URL.createObjectURL(selectedFile));
    }
  };

  // Handle avatar upload to Firebase and then to backend
  const handleSaveAvatar = async () => {
    if (!file) return;

    try {
      const storage = getStorage();
      const storageRef = ref(storage, `avatars/${userId}/${file.name}`);

      // Upload to Firebase
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Update user with the new avatar URL
      await uploadAvatar(file); // Your existing backend API handles the user update
    } catch (error) {
      toast.error('Failed to upload avatar to Firebase');
      console.error(error);
    }
  };

  return (
    <Box className='mb-6 flex items-center space-x-4'>
      <Button
        variant='outlined'
        color='primary'
        onClick={() => document.getElementById('avatar-upload')?.click()}
        className='!p-0 !rounded-full !border-[4px]'
        disabled={isPending}
      >
        <Avatar src={avatar || '/default-avatar.jpg'} className='!h-20 !w-20' />
        {isPending && <CircularProgress size={20} className='absolute' />}
        <input id='avatar-upload' type='file' accept='image/*' className='hidden' hidden onChange={handleFileChange} />
      </Button>
      {file && (
        <Button variant='contained' color='primary' onClick={handleSaveAvatar} disabled={isPending}>
          Save Avatar
        </Button>
      )}
    </Box>
  );
};

export default AvatarUpload;
