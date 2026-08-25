import React, { useState, useEffect } from 'react';
import { Joyride } from 'react-joyride';
import type { Step } from 'react-joyride';
import { useNavigate } from 'react-router-dom';

type CustomStep = Step & { route?: string };

const Tooltip = ({ index, step, backProps, closeProps, primaryProps, tooltipProps, isLastStep }: any) => {
    return (
        <div {...tooltipProps} className="bg-cde-bg border border-cde-text p-6 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] max-w-sm text-cde-text-muted font-mono z-[10000]">
            <div className="mb-6 text-sm leading-relaxed">{step.content}</div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-cde-border">
                {index > 0 ? (
                    <button {...backProps} className="text-xs uppercase tracking-widest text-cde-text-muted hover:text-cde-text transition-colors font-bold px-2 py-1">
                        Atrás
                    </button>
                ) : <div></div>}
                <div className="flex gap-4 ml-auto items-center">
                    {!isLastStep && (
                        <button {...closeProps} className="text-[10px] uppercase tracking-widest text-cde-text-muted hover:text-white transition-colors">
                            Saltar
                        </button>
                    )}
                    <button {...primaryProps} className="bg-cde-bg-lighter border border-cde-text text-cde-text hover:bg-cde-text hover:text-cde-bg px-4 py-2 rounded text-xs font-bold uppercase tracking-widest transition-all">
                        {isLastStep ? '¡Comenzar!' : 'Siguiente'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const Tutorial: React.FC = () => {
    const [run, setRun] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const hasCompletedTutorial = localStorage.getItem('cde_tutorial_completed');
        if (!hasCompletedTutorial) {
            setRun(true);
        }
    }, []);

    const steps: CustomStep[] = [
        {
            target: 'body',
            route: '/',
            placement: 'center',
            content: (
                <div className="text-left">
                    <h3 className="font-bold text-xl mb-3 text-cde-text uppercase tracking-widest leading-tight">¡Bienvenido al<br/>Tracker!</h3>
                    <p>Este es tu nuevo centro de mando personal. Vamos a dar un rápido recorrido animado para que entiendas cómo convertirte en la mejor versión de ti mismo.</p>
                </div>
            ),
        },
        {
            target: '.nav-dashboard',
            route: '/',
            content: (
                <div className="text-left">
                    <h3 className="font-bold text-cde-text uppercase tracking-wide mb-2 text-lg">Dashboard</h3>
                    <p>Aquí verás tu resumen diario: las tareas pendientes de hoy y los hábitos que debes marcar antes de dormir.</p>
                </div>
            ),
        },
        {
            target: '.nav-metas',
            route: '/metas',
            content: (
                <div className="text-left">
                    <h3 className="font-bold text-cde-text uppercase tracking-wide mb-2 text-lg">Gestión de Metas</h3>
                    <p>Crea objetivos grandes a largo plazo, y divídelos en pequeñas tareas ejecutables. ¡Divide y vencerás!</p>
                </div>
            ),
        },
        {
            target: '.nav-habitos',
            route: '/habitos',
            content: (
                <div className="text-left">
                    <h3 className="font-bold text-cde-text uppercase tracking-wide mb-2 text-lg">Tus Hábitos</h3>
                    <p>Configura qué días de la semana quieres realizar ciertas rutinas. Se generarán automáticamente en tu Dashboard.</p>
                </div>
            ),
        },
        {
            target: '.nav-perfil',
            route: '/perfil',
            content: (
                <div className="text-left">
                    <h3 className="font-bold text-cde-text uppercase tracking-wide mb-2 text-lg">Perfil RPG</h3>
                    <p>¡La mejor parte! Aquí verás tu progreso como si fueras el personaje principal de un videojuego.</p>
                </div>
            ),
        },
        {
            target: '.level-tutorial-target',
            route: '/perfil',
            content: (
                <div className="text-left">
                    <h3 className="font-bold text-cde-text uppercase tracking-wide mb-2 text-lg">Sube de Nivel</h3>
                    <p>Completar tareas y hábitos te otorga <strong>Puntos de Experiencia (EXP)</strong>. ¡Acumula EXP para subir de nivel y desbloquear tu potencial!</p>
                </div>
            ),
        },
        {
            target: '.radar-tutorial-target',
            route: '/perfil',
            content: (
                <div className="text-left">
                    <h3 className="font-bold text-cde-text uppercase tracking-wide mb-2 text-lg">Tus Atributos</h3>
                    <p>Tus acciones definen tus estadísticas (Disciplina, Productividad, etc). Abajo encontrarás el "Análisis Táctico" que te dirá exactamente cómo mejorar cada una.</p>
                </div>
            ),
        },
        {
            target: 'body',
            route: '/perfil',
            placement: 'center',
            content: (
                <div className="text-left">
                    <h3 className="font-bold text-xl mb-3 text-cde-text uppercase tracking-widest">¡Estás Listo!</h3>
                    <p>El sistema está preparado. Dirígete a "Metas" para crear tu primer objetivo, o a "Hábitos" para empezar una rutina. ¡Mucho éxito!</p>
                </div>
            ),
        }
    ];

    const handleJoyrideCallback = (data: any) => {
        const { action, index, status, type } = data;
        
        if (status === 'finished' || status === 'skipped') {
            setRun(false);
            setStepIndex(0);
            localStorage.setItem('cde_tutorial_completed', 'true');
        } else if (type === 'step:after' || type === 'error:target_not_found') {
            if (action === 'next' && index === steps.length - 1) {
                setRun(false);
                setStepIndex(0);
                localStorage.setItem('cde_tutorial_completed', 'true');
                return;
            }

            const nextStepIndex = index + (action === 'prev' ? -1 : 1);
            if (nextStepIndex >= 0 && nextStepIndex < steps.length) {
                const nextRoute = steps[nextStepIndex].route;
                if (nextRoute) {
                    navigate(nextRoute);
                }
                setStepIndex(nextStepIndex);
            }
        }
    };

    return (
        <Joyride
            steps={steps}
            run={run}
            stepIndex={stepIndex}
            continuous
            onEvent={handleJoyrideCallback}
            tooltipComponent={Tooltip}
            styles={{
                overlay: {
                    backgroundColor: 'rgba(21, 15, 14, 0.85)',
                }
            }}
        />
    );
};
