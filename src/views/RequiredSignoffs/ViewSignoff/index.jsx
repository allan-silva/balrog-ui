import React, { useState, useEffect } from 'react';
import { bool } from 'prop-types';
import ErrorPanel from '@mozilla-frontend-infra/components/ErrorPanel';
import { makeStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ContentSaveIcon from 'mdi-react/ContentSaveIcon';
import PlusIcon from 'mdi-react/PlusIcon';
import Dashboard from '../../../components/Dashboard';
import { getProducts } from '../../../utils/Rules';
import tryCatch from '../../../utils/tryCatch';
import getRequiredSignoffs from '../utils/getRequiredSignoffs';

const useStyles = makeStyles(theme => ({
  iconButtonGrid: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconButton: {
    marginTop: theme.spacing(1),
  },
  fab: {
    ...theme.mixins.fab,
  },
  gridWithIcon: {
    marginTop: theme.spacing(3),
  },
}));

function ViewSignoff(props) {
  const classes = useStyles();
  // eslint-disable-next-line no-unused-vars
  const [products, setProducts] = useState();
  // eslint-disable-next-line no-unused-vars
  const [requiredSignoffs, setRequiredSignoffs] = useState(null);
  const [error, setError] = useState();
  const [type, setType] = useState('channel');
  const handleTypeChange = ({ target: { value } }) => setType(value);

  useEffect(() => {
    tryCatch(getProducts()).then(([error, result]) => {
      if (error) {
        setError(error);

        return;
      }

      setProducts(result.data.product);
    });

    tryCatch(getRequiredSignoffs()).then(([error, rs]) => {
      if (error) {
        setError(error);

        return;
      }

      setRequiredSignoffs(rs);
    });
  }, [props.product, props.channel]);

  return (
    <Dashboard>
      {error && <ErrorPanel error={error} />}
      <form autoComplete="off">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField autoFocus fullWidth label="Product" required />
          </Grid>
          <Grid item xs={12}>
            <FormControl margin="normal" component="fieldset">
              <FormLabel component="legend">Type</FormLabel>
              <RadioGroup
                aria-label="Channel"
                name="channel"
                value={type}
                onChange={handleTypeChange}>
                <FormControlLabel
                  value="channel"
                  control={<Radio />}
                  label="Channel"
                />
                <FormControlLabel
                  value="permission"
                  control={<Radio />}
                  label="Permission"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          {type === 'channel' && (
            <Grid item xs={12}>
              <TextField fullWidth label="Channel" />
            </Grid>
          )}
        </Grid>
        <Grid className={classes.gridWithIcon} container spacing={2}>
          <Grid item xs>
            <TextField fullWidth label="Role" />
          </Grid>
          <Grid item xs>
            <TextField
              fullWidth
              label="Signoffs Required"
              type="number"
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid className={classes.iconButtonGrid} item xs={1}>
            <IconButton className={classes.iconButton}>
              <PlusIcon />
            </IconButton>
          </Grid>
        </Grid>
      </form>
      <Fab color="primary" className={classes.fab}>
        <ContentSaveIcon />
      </Fab>
    </Dashboard>
  );
}

ViewSignoff.propTypes = {
  isNewSignoff: bool,
};

ViewSignoff.defaultProps = {
  isNewSignoff: false,
};

export default ViewSignoff;