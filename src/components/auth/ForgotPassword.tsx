import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useCallback, useState } from 'react';
import { resetPassword } from '../../api/auth';

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const handleSubmit = useCallback(async () => {
    if (!email) {
      return;
    }
    await resetPassword({ email });
    handleClose();
  }, [email]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            handleSubmit();
            handleClose();
          },
          sx: { backgroundImage: 'none' },
        },
      }}
    >
      <DialogTitle>Reset password</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        <DialogContentText>이메일 주소를 입력하면 비밀번호 재설정 링크를 보내드립니다.</DialogContentText>
        <OutlinedInput
          autoFocus
          required
          margin="dense"
          id="email"
          name="email"
          label="이메일 주소"
          placeholder="이메일 주소"
          type="email"
          fullWidth
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>취소</Button>
        <Button variant="contained" type="submit">
          보내기
        </Button>
      </DialogActions>
    </Dialog>
  );
}
