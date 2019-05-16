import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import AccountGroupIcon from 'mdi-react/AccountGroupIcon';
import AccountSupervisorIcon from 'mdi-react/AccountSupervisorIcon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Dashboard from '../../../components/Dashboard';
import { getUserInfo, permissionStrings } from '../../../utils/Users';
import tryCatch from '../../../utils/tryCatch';

function User(props) {
  const {
    match: {
      params: { username },
    },
  } = props;
  const [user, setUser] = useState({ permissions: {}, roles: {} });

  useEffect(() => {
    (async () => {
      const [error, result] = await tryCatch(getUserInfo(username));

      if (error !== null) {
        // TODO: what's the proper way of handling this?
        console.log(error);
      } else {
        setUser(result.data);
      }
    })();
  }, []);

  return (
    <Dashboard>
      <Typography variant="h4">{user.username}…</Typography>
      <List>
        {Object.keys(user.permissions).map(permission => {
          const actionStr = 'perform any action';
          const productStr = 'for all products';
          const words = permissionStrings(productStr, actionStr);

          return (
            <ListItem key={permission}>
              <ListItemIcon>
                <AccountSupervisorIcon />
              </ListItemIcon>
              <ListItemText>{words[permission]}</ListItemText>
            </ListItem>
          );
        })}
        {Object.keys(user.roles).map(role => (
          <ListItem key={role}>
            <ListItemIcon>
              <AccountGroupIcon />
            </ListItemIcon>
            <ListItemText>
              {user.username} has {role}
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Dashboard>
  );
}

export default User;
