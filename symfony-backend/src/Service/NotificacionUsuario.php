<?php

namespace App\Service;

use App\Entity\Usuario;
use Psr\Log\LoggerInterface;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;

class NotificacionUsuario
{
    private const TEMPLATE_BIENVENIDA = 'emails/bienvenida.html.twig';
    private const TEMPLATE_RESET_PASSWORD = 'emails/reset_password.html.twig';

    public function __construct(
        private readonly MailerInterface $mailer,
        private readonly ?LoggerInterface $logger = null,
        private readonly string $fromEmail = 'tucorreoprueba@todo-app.local',
        private readonly string $fromName = 'To-Do App',
        private readonly string $frontendUrl = 'https://todo-app.local/login'
    ) {
    }

    public function enviarBienvenida(Usuario $usuario): bool
    {
        $context = [
            'usuario' => $usuario,
            'frontend_url' => $this->frontendUrl,
        ];

        return $this->enviarCorreo(
            usuario: $usuario,
            asunto: 'Bienvenido a To-Do App',
            template: self::TEMPLATE_BIENVENIDA,
            contexto: $context
        );
    }

    public function enviarResetPassword(Usuario $usuario, string $passwordTemporal): bool
    {
        $context = [
            'usuario' => $usuario,
            'passwordTemporal' => $passwordTemporal,
            'frontend_url' => $this->frontendUrl,
        ];

        return $this->enviarCorreo(
            usuario: $usuario,
            asunto: 'Instrucciones para restablecer tu contraseña',
            template: self::TEMPLATE_RESET_PASSWORD,
            contexto: $context
        );
    }

    private function enviarCorreo(
        Usuario $usuario,
        string $asunto,
        string $template,
        array $contexto
    ): bool {

        $to = new Address(
            address: (string) $usuario->getEmail(),
            name: $usuario->getNombre() ?? ''
        );

        try {
            // Creamos el email
            $email = (new TemplatedEmail())
                ->from(new Address($this->fromEmail, $this->fromName))
                ->to($to)
                ->subject($asunto)
                ->htmlTemplate($template)
                ->context($contexto);

            // Incrustamos el logo en el correo
            $logoPath = __DIR__ . '/../../public/images/logomailer.png';
            if (file_exists($logoPath)) {
                $contexto['logo_cid'] = $email->embedFromPath($logoPath);
                $email->context($contexto);
            }

            $this->mailer->send($email);

            return true;

        } catch (TransportExceptionInterface|\Throwable $exception) {

            $this->logger?->error('No se pudo enviar el correo al usuario.', [
                'usuarioId' => $usuario->getId(),
                'email' => $usuario->getEmail(),
                'template' => $template,
                'exception' => $exception,
            ]);

            return false;
        }
    }
}