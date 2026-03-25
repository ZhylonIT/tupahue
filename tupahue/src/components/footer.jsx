import { Box, Container, Typography, Grid, IconButton, Link, Divider } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { NavLink } from 'react-router-dom';
import logoTupahue from '../assets/images/logo.png';
import logoZhylon from '../assets/images/logozhylonfooter.png'; 
import { CintasPanuelo } from './CintasPanuelos';

const VIOLETA_SCOUT = '#5A189A';

export const Footer = () => {
    return (
        <Box component="footer" sx={{ bgcolor: VIOLETA_SCOUT, mt: 'auto' }}>

            {/* 1. Cintas invertidas */}
            <Box sx={{ transform: 'rotate(180deg)', bgcolor: 'white' }}>
                <CintasPanuelo />
            </Box>

            {/* Reducimos py: 6 a pt: 6 y pb: 2 para controlar el cierre */}
            <Container maxWidth="lg" sx={{ pt: 6, pb: 2, color: 'white' }}>
                <Grid container spacing={4} justifyContent="space-between">

                    {/* COLUMNA 1: LOGO Y FRASE */}
                    <Grid item xs={12} md={5}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                            <Box
                                component="img"
                                src={logoTupahue}
                                alt="Logo"
                                sx={{ height: '100px' }}
                            />
                            <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: 'Ubuntu', color: 'white' }}>
                                GRUPO SCOUT TUPAHUE
                            </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2, color: 'rgba(255,255,255,0.8)' }}>
                            {/* "Tratar de dejar este mundo en mejores condiciones de como lo encontramos." */}
                            "A veces, la democracia se equivoca"
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                            {/* — Baden Powell */}
                            — Hernan Moreiras
                        </Typography>
                    </Grid>

                    {/* COLUMNA 2: NAVEGACIÓN */}
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: 'white', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>
                            Navegación
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {['Inicio', 'Historia', 'Ramas', 'Contacto'].map((item) => (
                                <Link
                                    key={item}
                                    component={NavLink}
                                    to={item === 'Inicio' ? '/' : `/${item.toLowerCase()}`}
                                    sx={{
                                        color: 'rgba(255,255,255,0.7)',
                                        textDecoration: 'none',
                                        fontSize: '0.95rem',
                                        transition: '0.2s',
                                        '&:hover': { color: 'white', pl: 1 }
                                    }}
                                >
                                    {item}
                                </Link>
                            ))}
                        </Box>
                    </Grid>

                    {/* COLUMNA 3: CONTACTO Y REDES */}
                    <Grid item xs={12} sm={6} md={5} sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: { xs: 'flex-start', md: 'flex-end' },
                        textAlign: { xs: 'left', md: 'right' }
                    }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: 'white', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>
                            ¿Dónde estamos?
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1,
                            mb: 3,
                            color: 'rgba(255,255,255,0.9)',
                            justifyContent: { xs: 'flex-start', md: 'flex-end' }
                        }}>
                            <LocationOnIcon fontSize="small" sx={{ mt: 0.3, display: { md: 'none' } }} />
                            <Typography variant="body2">
                                Monroe 750 <br /> Ituzaingó, Buenos Aires
                            </Typography>
                            <LocationOnIcon fontSize="small" sx={{ mt: 0.3, display: { xs: 'none', md: 'block' } }} />
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                            {[
                                { icon: <InstagramIcon />, color: '#E1306C', url: 'https://www.instagram.com/grupotupahue/?hl=es' },
                                { icon: <FacebookIcon />, color: '#4267B2', url: 'https://www.facebook.com/grupotupahue/?locale=es_LA' },
                                { icon: <WhatsAppIcon />, color: '#25D366', url: 'https://chat.whatsapp.com/CLwLHvggsVZ9fwqSjnnCSv' }
                            ].map((social, index) => (
                                <IconButton
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        color: 'white',
                                        '&:hover': { bgcolor: 'white', color: social.color, transform: 'translateY(-3px)' },
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    {social.icon}
                                </IconButton>
                            ))}
                        </Box>
                    </Grid>
                </Grid>

                {/* COPYRIGHT - Eliminamos mt: 4 para pegar el logo al contenido */}
                <Box sx={{ textAlign: 'center', mt: 2 }}> 
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'rgba(255,255,255,0.5)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        © {new Date().getFullYear()} Desarrollado por
                        <Link
                            href="https://tu-sitio-web.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                ml: -2.5, // Mantengo tu ajuste negativo para compensar el aire de la imagen
                                transition: '0.3s',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    filter: 'brightness(1.2)'
                                }
                            }}
                        >
                            <Box
                                component="img"
                                src={logoZhylon}
                                alt="Zhylon IT"
                                sx={{
                                    height: '50px', // Bajamos un poco la altura para que no genere scroll interno
                                    width: 'auto',
                                    objectFit: 'contain',
                                    display: 'block'
                                }}
                            />
                        </Link>
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};