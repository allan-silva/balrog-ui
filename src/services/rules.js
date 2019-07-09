import { stringify } from 'qs';
import axios from 'axios';

const getRules = () => axios.get('/rules');
const getRule = id => axios.get(`/rules/${id}`);
const getChannels = () => axios.get('/rules/columns/channel');
const getProducts = () => axios.get('/rules/columns/product');
const getHistory = (id, limit, page) =>
  axios.get(`/${id}/revisions?${stringify({ limit, page })}`);
// const getRule = () => axios.get();
// const updateRule = () => axios.put();
const deleteRule = ({ ruleId, dataVersion }) =>
  axios.delete(`/rules/${ruleId}`, { params: { data_version: dataVersion } });
// const addRule = () => axios.post();
// const revertRule = () => axios.post();
const getScheduledChanges = all => {
  if (all === true) {
    return axios.get(`/scheduled_changes/rules?${stringify({ all: 1 })}`);
  }

  return axios.get('/scheduled_changes/rules');
};

const getScheduledChange = ruleId =>
  axios.get(`/scheduled_changes/rules?rule_id=${ruleId}`);
const addScheduledChange = ({
  ruleId,
  dataVersion,
  changeType,
  ...data
}) =>
  axios.post(`/scheduled_changes/rules`, {
    rule_id: ruleId,
    data_version: dataVersion,
    change_type: changeType,
    ...data,
  });

const updateScheduledChange = ({
  scId,
  scDataVersion,
  ...data,
}) =>
  axios.post(`/scheduled_changes/rules/${scId}`, {
    sc_id: scId,
    sc_data_version: scDataVersion,
    ...data,
  });

// const getScheduledChangeHistory = () => axios.get();
// const updateScheduledChange = () => axios.get();
// const deleteScheduledChange = () => axios.get();
// const signoffOnScheduledChange = () => axios.get();
// const revokeSignoffOnScheduledChange = () => axios.get();
// const ruleSignoffsRequired = () => axios.get();

// Rules factory
export {
  getRules,
  deleteRule,
  getRule,
  getChannels,
  getProducts,
  getHistory,
  getScheduledChanges,
  getScheduledChange,
  addScheduledChange,
  updateScheduledChange,
};
