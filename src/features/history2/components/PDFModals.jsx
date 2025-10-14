import { PDFViewer } from '@react-pdf/renderer';
import dayjs from '../../../utils/dayjsConfig';
import UniversalModal from '../../../components/Modal/UniversalModal';
import TicketPDF from '../../../components/PdfTemplates/TicketPDF';
import FichaPDF from '../../../components/PdfTemplates/FichaPDF';
import { COMPANY_INFO, MODAL_WIDTHS, PDF_VIEWER_CONFIG } from '../constants';

/**
 * Modal para vista previa de Ticket
 */
export const TicketModal = ({
  visible,
  onClose,
  appointment,
  patientHistory,
  patient = null,
}) => {
  if (!appointment) {
    return null;
  }

  // Obtener datos del paciente de múltiples fuentes posibles
  const patientData = patient || patientHistory?.data?.patient || appointment?.patient;
  const patientName = patientData
    ? `${patientData.paternal_lastname || ''} ${patientData.maternal_lastname || ''} ${patientData.name || ''}`.trim()
    : '';

  return (
    <UniversalModal
      title="Vista Previa - Ticket"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={MODAL_WIDTHS.TICKET_PREVIEW}
      className="ticket-modal modal-themed"
      destroyOnClose={true}
      centered={true}
      styles={{
        body: {
          padding: '0 !important',
          backgroundColor: 'var(--color-background-primary) !important',
        },
      }}
    >
      <PDFViewer
        width={PDF_VIEWER_CONFIG.DEFAULT_WIDTH}
        height={PDF_VIEWER_CONFIG.TICKET_HEIGHT}
        showToolbar={PDF_VIEWER_CONFIG.SHOW_TOOLBAR}
      >
        <TicketPDF
          company={COMPANY_INFO}
          ticket={{
            number: appointment.ticket_number,
            date: dayjs(appointment.appointment_date).format('DD-MM-YYYY'),
            patient: patientName,
            service: 'Consulta',
            unit: 1,
            amount: `S/ ${Number(appointment.payment).toFixed(2)}`,
            paymentType:
              appointment.payment_type?.name || 'Sin especificar',
          }}
        />
      </PDFViewer>
    </UniversalModal>
  );
};

/**
 * Modal para vista previa de Ficha
 */
export const FichaModal = ({
  visible,
  onClose,
  appointment,
  patientHistory,
  appointmentsCount,
  patient = null,
}) => {
  if (!appointment) {
    return null;
  }

  // Obtener datos del paciente de múltiples fuentes posibles
  const patientData = patient || patientHistory?.data?.patient || appointment?.patient;
  
  if (!patientData) {
    return null;
  }

  return (
    <UniversalModal
      title="Vista Previa - Ficha"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={MODAL_WIDTHS.FICHA_PREVIEW}
      className="ficha-modal modal-themed"
      destroyOnClose={true}
      centered={true}
      styles={{
        body: {
          padding: '0 !important',
          backgroundColor: 'var(--color-background-primary) !important',
        },
      }}
    >
      <PDFViewer
        width="95%"
        height={PDF_VIEWER_CONFIG.FICHA_HEIGHT}
        showToolbar={PDF_VIEWER_CONFIG.SHOW_TOOLBAR}
      >
        <FichaPDF
          cita={appointment}
          paciente={patientData}
          visitas={appointmentsCount}
          historia={patientHistory?.data}
        />
      </PDFViewer>
    </UniversalModal>
  );
};

