const swaggerUi = require('swagger-ui-express');

const documentazioneSwagger = {
  openapi: '3.0.3',

  info: {
    title: 'API PolInfo',
    version: '1.0.0',
    description:
      'API REST per la consultazione degli esami universitari.'
  },

  servers: [
    {
      url: '/',
    }
  ],

  tags: [ // MACROSEZIONE
    {
      name: 'Autenticazione',
      description: 'Registrazione, login e gestione dell account'
    },
    {
      name: 'Esami',
      description: 'Ricerca e gestione degli esami'
    },
    {
      name: 'Recensioni',
      description: 'Inserimento delle recensioni'
    }
  ],

  components: { // CHIEDERE
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'token',
        description:
          'Cookie HTTP-only contenente il token JWT, creato automaticamente durante il login.'
      }
    },

    schemas: { // SCHEMI IN BASSO
      CredenzialiUtente: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'studente@gmail.com'
          },
          password: {
            type: 'string',
            format: 'password',
            example: 'password123'
          }
        }
      },

      CredenzialiCineca: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: {
            type: 'string',
            example: 'nome.cognome'
          },
          password: {
            type: 'string',
            format: 'password',
            example: 'passwordCineca'
          }
        }
      },

      Utente: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '66a123456789abcdef123456'
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'studente@gmail.com'
          }
        }
      },

      Recensione: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '66b123456789abcdef123456'
          },
          userId: {
            type: 'string',
            example: '66a123456789abcdef123456'
          },
          difficolta: {
            type: 'number',
            minimum: 1,
            maximum: 5,
            example: 4
          },
          tempo_di_studio_settimane: {
            type: 'number',
            example: 6
          },
          tempi_di_correzione: {
            type: 'number',
            example: 14
          },
          commento: {
            type: 'string',
            example: 'Esame impegnativo, ma il materiale è sufficiente.'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },

      NuovaRecensione: {
        type: 'object',
        required: [
          'usernameCineca',
          'passwordCineca',
          'difficolta',
          'tempo_di_studio_settimane',
          'tempi_di_correzione',
          'commento'
        ],
        properties: {
          usernameCineca: {
            type: 'string',
            example: 'nome.cognome'
          },
          passwordCineca: {
            type: 'string',
            format: 'password',
            example: 'passwordCineca'
          },
          difficolta: {
            type: 'number',
            minimum: 1,
            maximum: 5,
            example: 4
          },
          tempo_di_studio_settimane: {
            type: 'number',
            minimum: 1,
            example: 6
          },
          tempi_di_correzione: {
            type: 'number',
            minimum: 0,
            example: 14
          },
          commento: {
            type: 'string',
            example: 'Esame impegnativo, ma interessante.'
          }
        }
      },

      Esame: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '66c123456789abcdef123456'
          },
          nome: {
            type: 'string',
            example: 'Analisi Matematica 1'
          },
          descrizione: {
            type: 'string',
            example: 'Studio dei limiti, delle derivate e degli integrali.'
          },
          professore: {
            type: 'string',
            example: 'Mario Rossi'
          },
          corsoDiStudi: {
            type: 'string',
            example: 'Informatica'
          },
          tempo_di_studio_settimane: {
            type: 'string',
            example: '8'
          },
          tempi_di_correzione: {
            type: 'number',
            example: 14
          },
          difficolta: {
            type: 'number',
            minimum: 1,
            maximum: 5,
            example: 4
          },
          recensioni: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Recensione'
            }
          }
        }
      },

      NuovoEsame: {
        type: 'object',
        required: [
          'nome',
          'descrizione',
          'professore',
          'corsoDiStudi'
        ],
        properties: {
          nome: {
            type: 'string',
            example: 'Programmazione Web'
          },
          descrizione: {
            type: 'string',
            example: 'Fondamenti dello sviluppo di applicazioni web.'
          },
          professore: {
            type: 'string',
            example: 'Prof. Ferrara'
          },
          corsoDiStudi: {
            type: 'string',
            example: 'Informatica'
          }
        }
      }
    }
  },

  paths: {
    '/api/autenticazione/registrazione': {
      post: {
        tags: ['Autenticazione'],
        summary: 'Registra un nuovo utente',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CredenzialiUtente'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Utente registrato correttamente',
            content: {
              'application/json': {
                example: {
                  messaggio: 'Utente registrato'
                }
              }
            }
          },
          500: {
            description: 'Errore durante la registrazione',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Errore'
                }
              }
            }
          }
        }
      }
    },

    '/api/autenticazione/login': {
      post: {
        tags: ['Autenticazione'],
        summary: 'Effettua il login',
        description:
          'Se le credenziali sono corrette, il server salva il token JWT nel cookie HTTP-only chiamato token.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CredenzialiUtente'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Login effettuato',
            headers: {
              'Set-Cookie': {
                description: 'Cookie contenente il token JWT',
                schema: {
                  type: 'string',
                  example: 'token=eyJhbGciOiJIUzI1Ni...; HttpOnly; Secure'
                }
              }
            },
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: {
                      $ref: '#/components/schemas/Utente'
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Password errata'
          },
          404: {
            description: 'Utente non trovato'
          },
          500: {
            description: 'Errore interno del server'
          }
        }
      }
    },

    '/api/autenticazione/me': {
      get: {
        tags: ['Autenticazione'],
        summary: 'Controlla se l’utente è autenticato',
        security: [
          {
            cookieAuth: []
          }
        ],
        responses: {
          200: {
            description: 'Token valido',
            content: {
              'application/json': {
                example: {
                  message: 'Accesso consentito alla rotta protetta',
                  user: {
                    id: '66a123456789abcdef123456',
                    iat: 1789200000,
                    exp: 1789210800
                  }
                }
              }
            }
          },
          400: {
            description: 'Token non valido'
          },
          401: {
            description: 'Cookie di autenticazione assente'
          }
        }
      }
    },

    '/api/autenticazione/login-cineca': {
      post: {
        tags: ['Autenticazione'],
        summary: 'Verifica le credenziali Cineca',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CredenzialiCineca'
              }
            }
          }
        },
        responses: {
          200: {
            description:
              'Risultato restituito dal servizio esterno Cineca/ESSE3'
          }
        }
      }
    },

    '/api/autenticazione/cookie-consenso': {
      post: {
        tags: ['Autenticazione'],
        summary: 'Salva il consenso ai cookie',
        responses: {
          200: {
            description: 'Consenso salvato',
            content: {
              'application/json': {
                example: {
                  message: 'Consenso cookie salvato'
                }
              }
            }
          }
        }
      }
    },

    '/api/autenticazione/logout': {
      post: {
        tags: ['Autenticazione'],
        summary: 'Effettua il logout',
        security: [
          {
            cookieAuth: []
          }
        ],
        responses: {
          200: {
            description: 'Logout completato',
            content: {
              'application/json': {
                example: {
                  message: 'Logout effettuato'
                }
              }
            }
          },
          400: {
            description: 'Token non valido'
          },
          401: {
            description: 'Utente non autenticato'
          }
        }
      }
    },

    '/api/esami/ricerca-esame': {
      get: {
        tags: ['Esami'],
        summary: 'Cerca un esame per nome',
        parameters: [
          {
            name: 'nome',
            in: 'query',
            required: true,
            description:
              'Nome completo dell’esame. La ricerca non distingue maiuscole e minuscole.',
            schema: {
              type: 'string'
            },
            example: 'Analisi Matematica 1'
          }
        ],
        responses: {
          200: {
            description: 'Esame trovato',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Esame'
                }
              }
            }
          },
          400: {
            description: 'Nome dell’esame non inserito'
          },
          404: {
            description: 'Esame non trovato'
          },
          500: {
            description: 'Errore interno del server'
          }
        }
      }
    },

    '/api/esami/{idEsame}/recensione': {
      post: {
        tags: ['Recensioni'],
        summary: 'Aggiunge una recensione a un esame',
        description:
          'Richiede il login dell’utente e la verifica delle credenziali Cineca.',
        security: [
          {
            cookieAuth: []
          }
        ],
        parameters: [
          {
            name: 'idEsame',
            in: 'path',
            required: true,
            description: 'Identificativo MongoDB dell’esame',
            schema: {
              type: 'string'
            },
            example: '66c123456789abcdef123456'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/NuovaRecensione'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Recensione inserita',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Recensione inserita con successo'
                    },
                    esame: {
                      $ref: '#/components/schemas/Esame'
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Token non valido oppure dati non validi'
          },
          401: {
            description:
              'Utente non autenticato o credenziali Cineca non valide'
          },
          404: {
            description: 'Esame non trovato'
          },
          500: {
            description: 'Errore durante l’inserimento della recensione'
          }
        }
      }
    },

    '/api/esami/aggiungi': {
      post: {
        tags: ['Esami'],
        summary: 'Inserisce un nuovo esame',
        description:
          'Rotta riservata agli utenti con ruolo admin.',
        security: [
          {
            cookieAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/NuovoEsame'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Esame inserito',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Esame inserito con successo'
                    },
                    esame: {
                      $ref: '#/components/schemas/Esame'
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Token non valido'
          },
          401: {
            description: 'Utente non autenticato'
          },
          403: {
            description: 'Utente non amministratore'
          },
          500: {
            description: 'Errore durante l’inserimento'
          }
        }
      }
    }
  }
};

function configuraSwagger(app) {
  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(documentazioneSwagger)
  );

  app.get('/api/docs.json', (req, res) => {
    res.json(documentazioneSwagger);
  });
}

module.exports = configuraSwagger;