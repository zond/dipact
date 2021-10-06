import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormGroup,
} from "@material-ui/core";
import React, { useState } from "react";
import useRegisterPageView from "../../hooks/useRegisterPageview";

interface ChatCreateChannelDialogProps {
  open: boolean;
  onClose: () => void;
  nations: string[];
  userNation: string;
  createChannel: (members: string[]) => void;
}

const title = "Create channel";
const prompt = "Pick the participants of the new channel.";

const ChatCreateChannelDialog = ({
  open,
  onClose,
  nations,
  userNation,
  createChannel,
}: ChatCreateChannelDialogProps): React.ReactElement => {
  const [members, setMembers] = useState<string[]>([userNation]);
  useRegisterPageView("CreateChannelDialog");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    nation: string
  ) => {
    if (e.target.checked) {
      setMembers([...members, nation]);
    } else {
      setMembers(members.filter((member) => member !== nation));
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{prompt}</DialogContentText>
        <FormGroup>
          {nations.map((nation) => (
            <FormControlLabel
              key={nation}
              label={nation}
              control={
                <Checkbox
                  disabled={nation === userNation}
                  checked={members.includes(nation)}
                  onChange={(e) => handleChange(e, nation)}
                />
              }
            />
          ))}
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={() => createChannel(members)} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChatCreateChannelDialog;
