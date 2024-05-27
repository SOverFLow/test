import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Grid } from "@mui/material";

const getFormattedTimeDifference = (start: Date, end: Date): string => {
  const diff = Math.abs(end.getTime() - start.getTime());
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return `${years} year${years > 1 ? "s" : ""} ago`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else if (weeks > 0) {
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  }
};
export default function CommentList({comments}:{comments:string[]}) {

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      { comments.length == 0 ? 
        <p>No comments</p> : 
        comments.map((data,index) => {
        return (
          <>
     <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Grid container display='flex' justifyContent='space-between'>
            <Grid item>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
              Worker 1
              </Typography>
            </Grid>
            <Grid item>
              <Typography sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary">
                {getFormattedTimeDifference(new Date(), new Date())}
              </Typography>
            </Grid>
          </Grid>
        }
        secondary={
            <Typography
              sx={{ 
                display: 'inline-block', // Changed to inline-block
                whiteSpace: 'nowrap', // Keeps the text in a single line
                overflow: 'hidden', // Hides overflow
                textOverflow: 'ellipsis', // Adds ellipsis to overflow
                width:'100%',
              }}
              component="span"
              variant="body2"
              color="text.primary"
            >
            {" — I'll be in your neighborhood doing errands this.— I'll be in your neighborhood doing errands this.— I'll be in your neighborhood doing errands this.— I'll be in your neighborhood doing errands this.— I'll be in your neighborhood doing errands this.— I'll be in your neighborhood doing errands this.— I'll be in your neighborhood doing errands this.— I'll be in your neighborhood doing errands this.— I'll be in your neighborhood doing errands this.— I'll be in your neighborhood doing errands this.— I'll be in your neighborhood doing errands this.— I'll be in your neighborhood doing errands this.— I'll be in your neighborhood doing errands this.— I'll be in your neighborhood doing errands this.— I'll be in your neighborhood doing errands this.— I'll be in your neighborhood doing errands this.— I'll be in your neighborhood doing errands this.— I'll be in your neighborhood doing errands this.— I'll be in your neighborhood doing errands this.— I'll be in your neighborhood doing errands this..."} 
            </Typography>
        }
      />
    </ListItem>

      <Divider variant="inset" component="li" />
      </>
      )})
    }
    </List>
  );
}
