<?php

namespace App\Repository;

use App\Entity\Tarea;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Tarea>
 */
class TareaRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Tarea::class);
    }

    //    /**
    //     * @return Tarea[] Returns an array of Tarea objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('t')
    //            ->andWhere('t.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('t.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Tarea
    //    {
    //        return $this->createQueryBuilder('t')
    //            ->andWhere('t.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }

    /**
 * Devuelve todas las tareas de un usuario ordenadas de la más reciente a la más antigua.
*
* @return Tarea[]
*/
public function findByUsuarioOrdenadas(int $usuarioId): array
{
    $qb = $this->createQueryBuilder('t'); // creamos el QueryBuilder con alias t

    return $qb
        ->andWhere('t.usuario = :usuarioId')    // filtramos por el usuario indicado
        ->setParameter('usuarioId', $usuarioId) // enlazamos el valor del parámetro
        ->orderBy('t.fechaCreacion', 'DESC')    // ordenamos por fecha de creación descendente
        ->getQuery()
        ->getResult();
}

/**
 * Busca tareas de un usuario aplicando filtros opcionales.
 *
 * @return Tarea[]
 */
public function buscarPorFiltros(int $usuarioId, ?string $estado, ?string $texto): array
{
    $qb = $this->createQueryBuilder('t'); // alias "t" para la entidad Tarea

    $qb->andWhere('t.usuario = :usuarioId')       // siempre filtramos por usuario
       ->setParameter('usuarioId', $usuarioId);

    // Filtro por estado (si se envía)
    if ($estado) {
        $qb->andWhere('t.estado = :estado')
           ->setParameter('estado', $estado);
    }

    // Filtro por texto en título o descripción (si se envía)
    if ($texto) {
        $qb->andWhere(
                'LOWER(t.titulo) LIKE :texto OR LOWER(t.descripcion) LIKE :texto'
            )
           ->setParameter('texto', '%' . strtolower($texto) . '%');
    }

    return $qb
        ->orderBy('t.fechaCreacion', 'DESC') // mantenemos orden por fecha reciente
        ->getQuery()
        ->getResult();
}

    /**
 * Devuelve tareas pendientes cuya fechaLimite esté dentro
 * del intervalo indicado a partir del momento actual.
 *
 * @return Tarea[]
 */
public function findPendientesPorVencer(int $usuarioId, \DateInterval $intervalo): array
{
    $ahora = new \DateTimeImmutable();
    $fechaLimiteMax = $ahora->add($intervalo);

    return $this->createQueryBuilder('t')
        ->andWhere('t.usuario = :usuarioId')
        ->andWhere('t.estado = :estado')
        ->andWhere('t.fechaLimite BETWEEN :ahora AND :fechaMax')
        ->setParameter('usuarioId', $usuarioId)
        ->setParameter('estado', 'pendiente')
        ->setParameter('ahora', $ahora)
        ->setParameter('fechaMax', $fechaLimiteMax)
        ->orderBy('t.fechaLimite', 'ASC')
        ->getQuery()
        ->getResult();
}
}
