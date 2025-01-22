import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import type { Itinerary, Destination, Transport } from '../types';
import { format } from 'date-fns';

// Initialize pdfMake with fonts
pdfMake.vfs = pdfFonts.pdfMake.vfs;

interface ItineraryPDFOptions {
  includeTransports?: boolean;
  includeExpenses?: boolean;
  includeMap?: boolean;
}

export async function generateItineraryPDF(
  itinerary: Itinerary,
  options: ItineraryPDFOptions = {}
): Promise<Blob> {
  const destinationsContent = itinerary.destinations.map(dest => 
    createDestinationSection(dest)
  );

  const transportsContent = options.includeTransports && itinerary.transports
    ? itinerary.transports.map(transport => createTransportSection(transport))
    : [];

  const docDefinition = {
    content: [
      // Header
      {
        text: itinerary.title,
        style: 'header',
        margin: [0, 0, 0, 10]
      },
      {
        text: itinerary.description || '',
        style: 'description',
        margin: [0, 0, 0, 20]
      },
      {
        text: `${format(new Date(itinerary.start_date), 'MMMM d, yyyy')} - ${format(new Date(itinerary.end_date), 'MMMM d, yyyy')}`,
        style: 'dates',
        margin: [0, 0, 0, 30]
      },

      // Destinations
      {
        text: 'Destinations',
        style: 'sectionHeader',
        margin: [0, 0, 0, 15]
      },
      ...destinationsContent,

      // Transports (if included)
      ...(options.includeTransports && transportsContent.length > 0 ? [
        {
          text: 'Transportation',
          style: 'sectionHeader',
          margin: [0, 30, 0, 15]
        },
        ...transportsContent
      ] : [])
    ],
    styles: {
      header: {
        fontSize: 24,
        bold: true,
        color: '#1a365d'
      },
      description: {
        fontSize: 14,
        color: '#4a5568',
        italics: true
      },
      dates: {
        fontSize: 16,
        color: '#2d3748'
      },
      sectionHeader: {
        fontSize: 20,
        bold: true,
        color: '#2d3748',
        margin: [0, 20, 0, 10]
      },
      destinationName: {
        fontSize: 18,
        bold: true,
        color: '#2d3748'
      },
      transportInfo: {
        fontSize: 14,
        color: '#4a5568'
      }
    },
    defaultStyle: {
      font: 'Roboto'
    },
    pageMargins: [40, 60, 40, 60],
    footer: function(currentPage: number, pageCount: number) {
      return {
        text: `Page ${currentPage} of ${pageCount}`,
        alignment: 'center',
        margin: [0, 20]
      };
    }
  };

  return new Promise((resolve) => {
    const printer = new pdfMake({
      Roboto: fonts.Roboto
    });
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    
    const chunks: Uint8Array[] = [];
    pdfDoc.on('data', (chunk) => chunks.push(chunk));
    pdfDoc.on('end', () => {
      const pdfBlob = new Blob(chunks, { type: 'application/pdf' });
      resolve(pdfBlob);
    });
    pdfDoc.end();
  });
}

function createDestinationSection(destination: Destination) {
  return {
    stack: [
      {
        text: destination.name,
        style: 'destinationName',
        margin: [0, 0, 0, 10]
      },
      {
        columns: [
          {
            width: 'auto',
            text: 'Dates: ',
            bold: true
          },
          {
            text: `${format(new Date(destination.start_date), 'MMM d')} - ${format(new Date(destination.end_date), 'MMM d, yyyy')}`
          }
        ],
        margin: [0, 0, 0, 5]
      },
      {
        columns: [
          {
            width: 'auto',
            text: 'Location: ',
            bold: true
          },
          {
            text: destination.location.address || `${destination.location.lat}, ${destination.location.lng}`
          }
        ],
        margin: [0, 0, 0, 5]
      },
      destination.notes ? {
        text: destination.notes,
        margin: [0, 5, 0, 10],
        italics: true
      } : {},
      {
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 5,
            x2: 515,
            y2: 5,
            lineWidth: 0.5,
            lineColor: '#e2e8f0'
          }
        ],
        margin: [0, 10]
      }
    ]
  };
}

function createTransportSection(transport: Transport) {
  const departureTime = new Date(transport.departure.datetime);
  const arrivalTime = new Date(transport.arrival.datetime);

  return {
    stack: [
      {
        columns: [
          {
            width: 'auto',
            text: `${transport.type.toUpperCase()}: `,
            bold: true
          },
          {
            text: `${transport.provider} (${transport.booking_reference})`
          }
        ],
        margin: [0, 0, 0, 5]
      },
      {
        columns: [
          {
            stack: [
              { text: 'Departure', bold: true },
              { text: format(departureTime, 'HH:mm, MMM d'), margin: [0, 2] },
              { text: transport.departure.location },
              transport.departure.terminal ? 
                { text: `Terminal: ${transport.departure.terminal}`, italics: true } : 
                {}
            ]
          },
          {
            stack: [
              { text: 'Arrival', bold: true },
              { text: format(arrivalTime, 'HH:mm, MMM d'), margin: [0, 2] },
              { text: transport.arrival.location },
              transport.arrival.terminal ? 
                { text: `Terminal: ${transport.arrival.terminal}`, italics: true } : 
                {}
            ]
          }
        ],
        columnGap: 20,
        margin: [0, 5, 0, 10]
      },
      transport.seats ? {
        text: `Seats: ${transport.seats.join(', ')}`,
        margin: [0, 0, 0, 5],
        italics: true
      } : {},
      transport.notes ? {
        text: transport.notes,
        margin: [0, 0, 0, 5],
        italics: true
      } : {},
      {
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 5,
            x2: 515,
            y2: 5,
            lineWidth: 0.5,
            lineColor: '#e2e8f0'
          }
        ],
        margin: [0, 10]
      }
    ]
  };
}