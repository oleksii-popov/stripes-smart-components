import React from 'react';
import PropTypes from 'prop-types';
import has from 'lodash/has';

import { Field } from 'redux-form';
import stripesForm from '@folio/stripes-form';

import Button from '@folio/stripes-components/lib/Button';
import Layout from '@folio/stripes-components/lib/Layout';
import Checkbox from '@folio/stripes-components/lib/Checkbox';
import TextField from '@folio/stripes-components/lib/TextField';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';

const propTypes = {
  addresses: PropTypes.arrayOf(PropTypes.object), // eslint-disable-line react/no-unused-prop-types
  addressObject: PropTypes.object,
  canDelete: PropTypes.bool,
  fieldComponents: PropTypes.object,
  handleCancel: PropTypes.func,
  handleDelete: PropTypes.func,
  handleSubmit: PropTypes.func,
  headerComponent: PropTypes.func,
  labelMap: PropTypes.object,
  uiId: PropTypes.string,
  visibleFields: PropTypes.arrayOf(PropTypes.string),
};

const defaultProps = {
  fieldComponents: {
    country: TextField,
    addressLine1: TextField,
    addressLine2: TextField,
    city: TextField,
    stateRegion: TextField,
    zipCode: TextField,
    addressType: TextField,
  },
  headerComponent: address => (
    <Field
      label="Primary Address"
      name="primaryAddress"
      type="checkbox"
      id={`PrimaryAddress---${address.id}`}
      component={Checkbox}
    />
  ),
  labelMap: {
    addressLine1: 'Address line 1',
    addressLine2: 'Address line 2',
    stateRegion: 'State/Province/Region',
    zipCode: 'Zip/Postal Code',
    addressType: 'Address Type',
    city: 'City',
    country: 'Country',
  },
  visibleFields: [
    'country',
    'addressLine1',
    'addressLine2',
    'city',
    'stateRegion',
    'zipCode',
    'addressType',
  ],
};

// example validation for a required country field
//
// const validate = values => {
//  const errors = {};
//  if (values.country == "") {
//    errors.country = 'Required';
//  }
//
//  return errors;
// };


const validate = (values, props) => {
  const errors = {};
  const addressType = values.addressType;
  const addresses = props.addresses || [];

  if (!addressType) {
    errors.addressType = 'Address type is required';
  }

  if (addresses.find(addr => addr.addressType === addressType)) {
    errors.addressType = 'Address type is already taken';
  }

  return errors;
};


const AddressEdit = (props) => {
  const {
    addressObject,
    canDelete,
    uiId,
    handleSubmit,
    handleDelete,
    handleCancel,
    labelMap,
    visibleFields,
    headerComponent,
    fieldComponents
  } = props;

  const mergedFieldComponents = Object.assign(defaultProps.fieldComponents, fieldComponents);
  const groupArray = [];
  let rowArray = [];

  visibleFields.forEach((field, i) => {
    const fieldLabel = has(labelMap, field) ? labelMap[field] : field;
    const componentData = mergedFieldComponents[field];
    let component = componentData;
    let compProps = {};

    if (componentData.component) {
      component = componentData.component;
    }

    if (componentData.props) {
      compProps = componentData.props;
    }

    const fieldComponent = (
      <Col key={`col-${i}`} xs={4}>
        <Field label={fieldLabel} name={field} {...compProps} component={component} />
      </Col>);
    rowArray.push(fieldComponent);

    // 3 fields per row...
    if (rowArray.length === 3 || i === visibleFields.length - 1) {
      groupArray.push(<Row key={`row-${i}`}>{rowArray}</Row>);
      rowArray = [];
    }
  }, this);

  return (
    <div>
      <form onSubmit={handleSubmit} id={`addressEdit-${uiId}`}>
        <Row>
          <Col xs={6}>{headerComponent(addressObject)}</Col>
        </Row>
        {groupArray}
        <Row>
          <Col xs={6}>
            <Field type="hidden" name="id" component="input" />
            <Field type="hidden" name="guiid" component="input" />
          </Col>
          <Col xs={6}>
            <Layout className="right marginTopHalf">
              { canDelete &&
                <Button buttonStyle="marginBottom0" onClick={() => handleDelete(uiId)}>
                  Remove this address
                </Button>
              }
              <Button buttonStyle="primary marginBottom0" type="submit">Save</Button>
              <Button buttonStyle="marginBottom0" onClick={() => handleCancel(uiId)}>Cancel</Button>
            </Layout>
          </Col>
        </Row>
      </form>
    </div>
  );
};

AddressEdit.propTypes = propTypes;
AddressEdit.defaultProps = defaultProps;

export default stripesForm({
  form: 'addressForm',
  validate,
  navigationCheck: true,
  enableReinitialize: true,
})(AddressEdit);
