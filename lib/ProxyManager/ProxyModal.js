import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import Modal from '@folio/stripes-components/lib/Modal';
import injectIntl from '@folio/stripes-components/lib/InjectIntl';
import ProxyForm from './ProxyForm';

class ProxyModal extends React.Component {
  static propTypes = {
    intl: intlShape,
    patron: PropTypes.object,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onContinue: PropTypes.func,
  };

  render() {
    const { onClose, open, patron, onContinue, intl } = this.props;

    return (
      <Modal onClose={onClose} open={open} size="small" label={intl.formatMessage({ id: 'stripes-smart-components.whoAreYouActingAs' })} dismissible>
        <ProxyForm
          onSubmit={onContinue}
          initialValues={{ sponsorId: patron.id }}
          onCancel={onClose}
          intl={this.props.intl}
          {...this.props}
        />
      </Modal>
    );
  }
}


export default injectIntl(ProxyModal);
