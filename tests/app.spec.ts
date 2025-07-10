import { test, expect } from '@playwright/test'

test.describe('Psimammoliti Online - Psicólogos y Reservas', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('h1:has-text("Psimammoliti Online")')
  })

  test('debería mostrar lista completa de psicólogos en tarjetas responsivas', async ({ page }) => {
    await expect(page.locator('[data-testid="psychologist-card"]')).toHaveCount(13)
    await expect(page.locator('[data-testid="psychologist-card"]').first()).toBeVisible()
    const firstCard = page.locator('[data-testid="psychologist-card"]').first()
    await expect(firstCard.locator('[class*="text-xl"]')).toBeVisible()
    await expect(firstCard.locator('img')).toBeVisible()
    await expect(firstCard.locator('[data-testid="specialties"]')).toBeVisible()
  })

  test('debería mostrar información detallada en cada tarjeta de psicólogo', async ({ page }) => {
    const firstCard = page.locator('[data-testid="psychologist-card"]').first()
    await expect(firstCard.locator('[class*="text-xl"]')).toBeVisible()
    await expect(firstCard.locator('img')).toBeVisible()
    await expect(firstCard.locator('[data-testid="experience"]')).toBeVisible()
    await expect(firstCard.locator('[data-testid="rating"]')).toBeVisible()
    await expect(firstCard.locator('[data-testid="specialties"]')).toBeVisible()
    await expect(firstCard.locator('[data-testid="description"]')).toBeVisible()
    await expect(firstCard.locator('[data-testid="price"]')).toBeVisible()
    await expect(firstCard.locator('[data-testid="modalities"]')).toBeVisible()
  })

  test('debería mostrar indicadores de disponibilidad en cada tarjeta', async ({ page }) => {
    const firstCard = page.locator('[data-testid="psychologist-card"]').first()
    await expect(firstCard.locator('[data-testid="availability-indicator"]')).toBeVisible()
    await expect(firstCard.locator('button:has-text("Ver Disponibilidad")')).toBeVisible()
  })

  test('debería permitir búsqueda en tiempo real por nombre o especialidad', async ({ page }) => {
    const searchInput = page.locator('input[name="search"]')
    await searchInput.fill('Depresión')
    await expect(page.locator('[data-testid="psychologist-card"]')).toHaveCount(5)
    await searchInput.clear()
    await expect(page.locator('[data-testid="psychologist-card"]')).toHaveCount(13)
  })

  test('debería permitir filtrar por especialidad específica', async ({ page }) => {
    await page.locator('[role="combobox"]').first().click()
    await page.locator('[role="option"]:has-text("Depresión")').click()
    await expect(page.locator('[data-testid="psychologist-card"]')).toHaveCount(5)
    await page.locator('[role="combobox"]').first().click()
    await page.locator('[role="option"]:has-text("Todas")').click()
    await expect(page.locator('[data-testid="psychologist-card"]')).toHaveCount(13)
  })

  test('debería permitir filtrar por modalidad', async ({ page }) => {
    await page.locator('[role="combobox"]').nth(1).click()
    await page.locator('[role="option"]:has-text("Online")').click()
    await expect(page.locator('[data-testid="psychologist-card"]')).toHaveCount(9)
    await page.locator('[role="combobox"]').nth(1).click()
    await page.locator('[role="option"]:has-text("Todas")').click()
    await expect(page.locator('[data-testid="psychologist-card"]')).toHaveCount(13)
  })

  test('debería mostrar badges visuales para filtros activos y contador de resultados', async ({ page }) => {
    await expect(page.locator('[data-testid="results-count"]')).toBeVisible()
    await page.locator('[role="combobox"]').first().click()
    await page.locator('[role="option"]:has-text("Depresión")').click()
    await expect(page.locator('[data-testid="results-count"]')).toContainText('5 psicólogos')
    await expect(page.locator('[data-testid="active-filter"]')).toBeVisible()
  })

  test('debería mostrar calendario semanal con navegación entre semanas', async ({ page }) => {
    await page.locator('[data-testid="psychologist-card"]').first().locator('button:has-text("Ver Disponibilidad")').click()
    await expect(page.locator('[data-testid="calendar"]')).toBeVisible()
    await expect(page.locator('button:has-text("Anterior")')).toBeVisible()
    await expect(page.locator('button:has-text("Siguiente")')).toBeVisible()
    await page.locator('button:has-text("Siguiente")').click()
    await expect(page.locator('[data-testid="week-display"]')).toBeVisible()
  })

  test('debería mostrar horarios en zona horaria local del usuario', async ({ page }) => {
    await page.locator('[data-testid="psychologist-card"]').first().locator('button:has-text("Ver Disponibilidad")').click()
    await expect(page.locator('[data-testid="user-timezone"]')).toBeVisible()
    const timeSlots = page.locator('[data-testid="time-slot"]')
    await expect(timeSlots.first()).toBeVisible()
  })

  test('debería permitir seleccionar modalidad por slot', async ({ page }) => {
    await page.locator('[data-testid="psychologist-card"]').first().locator('button:has-text("Ver Disponibilidad")').click()
    const availableSlot = page.locator('[data-testid="time-slot"]:not(.booked)').first()
    await availableSlot.click()
    await expect(availableSlot).toHaveClass(/selected/)
  })

  test('debería mostrar formulario de paciente con validación', async ({ page }) => {
    await page.locator('[data-testid="psychologist-card"]').first().locator('button:has-text("Ver Disponibilidad")').click()
    await expect(page.locator('input[name="patientName"]')).toBeVisible()
    await expect(page.locator('input[name="patientEmail"]')).toBeVisible()
    await page.locator('[data-testid="time-slot"]:not(.booked)').first().click()
    await page.locator('input[name="patientName"]').fill('Juan')
    await expect(page.locator('[data-testid="validation-error"]')).toBeVisible()
  })

  test('debería mostrar resumen de cita antes de confirmar', async ({ page }) => {
    await page.locator('[data-testid="psychologist-card"]').first().locator('button:has-text("Ver Disponibilidad")').click()
    await page.locator('[data-testid="time-slot"]:not(.booked)').first().click()
    await page.locator('input[name="patientName"]').fill('Juan Pérez')
    await page.locator('input[name="patientEmail"]').fill('juan@example.com')
    await expect(page.locator('[data-testid="booking-summary"]')).toBeVisible()
    await expect(page.locator('[data-testid="booking-summary"]')).toContainText('Resumen de tu Cita')
  })

  test('debería detectar automáticamente la zona horaria del navegador', async ({ page }) => {
    await expect(page.locator('[data-testid="timezone-display"]')).toBeVisible()
    const timezoneText = await page.locator('[data-testid="timezone-display"]').textContent()
    expect(timezoneText).not.toBe('')
  })

  test('debería convertir horarios UTC a hora local', async ({ page }) => {
    await page.locator('[data-testid="psychologist-card"]').first().locator('button:has-text("Ver Disponibilidad")').click()
    const timeSlots = page.locator('[data-testid="time-slot"]')
    await expect(timeSlots.first()).toBeVisible()
    const timeText = await timeSlots.first().textContent()
    expect(timeText).not.toContain('UTC')
  })

  test('debería ocultar automáticamente horarios pasados', async ({ page }) => {
    await page.locator('[data-testid="psychologist-card"]').first().locator('button:has-text("Ver Disponibilidad")').click()
    const pastSlots = page.locator('[data-testid="time-slot"].past')
    await expect(pastSlots).toHaveCount(0)
  })

  test('debería mostrar indicadores visuales para diferentes estados de disponibilidad', async ({ page }) => {
    await page.locator('[data-testid="psychologist-card"]').first().locator('button:has-text("Ver Disponibilidad")').click()
    await expect(page.locator('[data-testid="time-slot"]:not(.booked)').first()).toBeVisible()
    await expect(page.locator('[data-testid="time-slot"].booked').first()).toBeVisible()
  })

  test('debería mostrar confirmación inmediata de reserva con modal detallado', async ({ page }) => {
    await page.locator('[data-testid="psychologist-card"]').first().locator('button:has-text("Ver Disponibilidad")').click()
    await page.locator('[data-testid="time-slot"]:not(.booked)').first().click()
    await page.locator('input[name="patientName"]').fill('María García')
    await page.locator('input[name="patientEmail"]').fill('maria@example.com')
    await page.locator('button:has-text("Confirmar Cita")').click()
    await expect(page.locator('[data-testid="confirmation-modal"]')).toBeVisible()
    await expect(page.locator('[data-testid="confirmation-modal"]')).toContainText('¡Cita Agendada!')
  })

  test('debería mostrar información específica según modalidad elegida', async ({ page }) => {
    await page.locator('[data-testid="psychologist-card"]').first().locator('button:has-text("Ver Disponibilidad")').click()
    await page.locator('input[name="patientName"]').fill('Test User')
    await page.locator('input[name="patientEmail"]').fill('test@example.com')
    const onlineSlot = page.locator('[data-testid="time-slot"][data-modality="online"]:not(.booked)').first()
    await onlineSlot.click()
    await expect(onlineSlot).toHaveClass(/selected/)
    await expect(page.locator('[data-testid="booking-summary"]')).toBeVisible()
    await expect(page.locator('[data-testid="modality-info"]')).toContainText('Sesión Online')
    const inPersonSlot = page.locator('[data-testid="time-slot"][data-modality="presencial"]:not(.booked)').first()
    await inPersonSlot.click()
    await expect(page.locator('[data-testid="modality-info"]')).toContainText('Sesión Presencial')
  })

  test('debería mostrar instrucciones claras para el día de la sesión', async ({ page }) => {
    await page.locator('[data-testid="psychologist-card"]').first().locator('button:has-text("Ver Disponibilidad")').click()
    await page.locator('[data-testid="time-slot"]:not(.booked)').first().click()
    await page.locator('input[name="patientName"]').fill('Carlos López')
    await page.locator('input[name="patientEmail"]').fill('carlos@example.com')
    await page.locator('button:has-text("Confirmar Cita")').click()
    await expect(page.locator('[data-testid="session-instructions"]')).toBeVisible()
    await expect(page.locator('[data-testid="session-instructions"]')).toContainText('Próximos pasos')
  })
})
