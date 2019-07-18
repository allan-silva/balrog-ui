import { equals } from 'ramda';
import {
  addRole,
  removeRole,
  addPermission,
  updatePermission,
  deletePermission,
  addScheduledPermissionChange,
  updateScheduledPermissionChange,
} from '../../../services/users';
import { supportsActionRestriction } from '../../../utils/userUtils';

export default params => {
  const {
    username,
    roles,
    originalRoles,
    additionalRoles,
    permissions,
    originalPermissions,
    additionalPermissions,
    requiredSignoffs,
  } = params;
  const currentRoles = roles.map(role => role.name);
  const removedRoles = originalRoles.filter(
    role => !currentRoles.includes(role.name)
  );
  const currentPermissions = permissions.map(p => p.name);
  const removedPermissions = originalPermissions.filter(
    p => !currentPermissions.includes(p.name)
  );

  // TODO: need to add support for grabbing scheduled permission changes to ViewUser
  // and figure out where those will be in the data structure. maybe compare to the rules
  // edit page to figure it out?
  return Promise.all(
    [].concat(
      additionalRoles.map(role => addRole(username, role.name)),
      removedRoles.map(role =>
        removeRole(username, role.name, role.data_version)
      ),
      permissions.map(permission => {
        console.log(`Processing ${permission.name}`);
        console.log(permission);
        const options = {products: permission.options.products}
        if (supportsActionRestriction(permission.name)) {
          options.actions = permission.options.actions;
        }
        let skip = false;

        originalPermissions.forEach(value => {
          // if permissions are the same, set skip to true
          // not sure if this condition will work
          if (value.name === permission.name && equals(value.options, permission.options)) {
            skip = true;
          }
        });

        if (skip) {
          return;
        }
        
        if (permission.sc_id) {
          return updateScheduledPermissionChange({
            username,
            permission: permission.name,
            options,
            dataVersion: permission.data_version,
            scId: permission.sc_id,
            scDataVersion: permission.data_version,
          });
        }

        return addScheduledPermissionChange({
          username,
          permission: permission.name,
          options,
          dataVersion: permission.data_version,
          changeType: 'update',
          when: new Date().getTime() + 5000,
        });
      }),
      additionalPermissions.map(permission => {}),
      removedPermissions.map(permission => {})
    )
  );
};
