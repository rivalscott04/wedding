
@extends('layouts.app')

@section('title', 'Data Pensiun')
@section('page-title', 'Data Pensiun')

@section('styles')
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.datatables.net/1.13.6/css/dataTables.bootstrap5.min.css" rel="stylesheet">
<link href="https://cdn.datatables.net/responsive/2.4.1/css/responsive.bootstrap5.min.css" rel="stylesheet">
<link href="https://cdn.datatables.net/buttons/2.4.1/css/buttons.bootstrap5.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
<link href="https://cdn.jsdelivr.net/npm/select2-bootstrap-5-theme@1.3.0/dist/select2-bootstrap-5-theme.min.css" rel="stylesheet" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
<link href="{{ asset('css/pensiun-modern.css') }}" rel="stylesheet">
@endsection

@section('content')
<div class="container-fluid fade-in">
    <!-- Page Header -->
    <div class="page-header-container d-flex justify-content-between align-items-center">
        <h1 class="page-header">Data Pensiun</h1>
        <button type="button" class="btn btn-primary-custom add-btn" data-bs-toggle="modal" data-bs-target="#pensiunModal">
            <i class="bi bi-plus-lg"></i> Tambah Data
        </button>
    </div>
    
    <!-- Statistics Row -->
    @if($pensiun->count() > 0)
    <div class="row mb-4">
        <div class="col-xl-3 col-md-6 mb-3">
            <div class="stat-card">
                <div class="d-flex justify-content-between">
                    <div>
                        <div class="stat-title">Total Data</div>
                        <div class="stat-value">{{ $pensiun->count() }}</div>
                    </div>
                    <div class="stat-icon stat-total">
                        <i class="bi bi-file-earmark-text"></i>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-xl-3 col-md-6 mb-3">
            <div class="stat-card">
                <div class="d-flex justify-content-between">
                    <div>
                        <div class="stat-title">Disetujui</div>
                        <div class="stat-value">{{ $pensiun->where('status', 'Disetujui')->count() }}</div>
                    </div>
                    <div class="stat-icon stat-approved">
                        <i class="bi bi-check-circle"></i>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-xl-3 col-md-6 mb-3">
            <div class="stat-card">
                <div class="d-flex justify-content-between">
                    <div>
                        <div class="stat-title">Diproses</div>
                        <div class="stat-value">{{ $pensiun->where('status', 'Diproses')->count() }}</div>
                    </div>
                    <div class="stat-icon stat-process">
                        <i class="bi bi-arrow-repeat"></i>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-xl-3 col-md-6 mb-3">
            <div class="stat-card">
                <div class="d-flex justify-content-between">
                    <div>
                        <div class="stat-title">Menunggu</div>
                        <div class="stat-value">{{ $pensiun->where('status', 'Diajukan')->count() }}</div>
                    </div>
                    <div class="stat-icon stat-waiting">
                        <i class="bi bi-hourglass-split"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
    @endif
    
    <!-- Content Card -->
    <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between">
            <h6 class="card-title mb-0">Daftar Data Pensiun</h6>
            <button id="refreshData" class="btn btn-outline-primary-custom btn-sm">
                <i class="bi bi-arrow-clockwise"></i> Refresh
            </button>
        </div>
        <div class="card-body">
            @if($pensiun->count() > 0)
            <div class="table-responsive">
                <table id="pensiun-table" class="table table-hover">
                    <thead>
                        <tr>
                            <th style="width: 5%">No</th>
                            <th style="width: 20%">Pegawai</th>
                            <th style="width: 12%">TMT Pensiun</th>
                            <th style="width: 15%">Tempat Tugas</th>
                            <th style="width: 10%">Jenis</th>
                            <th style="width: 10%">Status</th>
                            <th style="width: 10%">File SK</th>
                            <th style="width: 15%" class="text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($pensiun as $index => $p)
                        <tr>
                            <td>{{ $index + 1 }}</td>
                            <td>
                                <div class="name-cell">{{ $p->pegawai->nama ?? 'N/A' }}</div>
                                <div class="nip-cell">{{ $p->nip }}</div>
                            </td>
                            <td>{{ \Carbon\Carbon::parse($p->tmt_pensiun)->format('d M Y') }}</td>
                            <td>{{ $p->tempat_tugas }}</td>
                            <td>{{ $p->jenis_pensiun }}</td>
                            <td>
                                <span class="status-badge status-{{ strtolower($p->status) }}">
                                    {{ $p->status }}
                                </span>
                            </td>
                            <td class="text-center">
                                @if($p->file_sk)
                                <a href="{{ route('pensiun.preview-file', $p->id) }}" target="_blank" class="file-badge">
                                    <i class="bi bi-file-earmark-text"></i> Lihat
                                </a>
                                @else
                                <span class="empty-file">—</span>
                                @endif
                            </td>
                            <td>
                                <div class="action-buttons">
                                    <a href="{{ route('pensiun.show', $p->id) }}" class="btn-action btn-view" data-bs-toggle="tooltip" title="Lihat Detail">
                                        <i class="bi bi-eye"></i>
                                    </a>
                                    <a href="{{ route('pensiun.edit', $p->id) }}" class="btn-action btn-edit" data-bs-toggle="tooltip" title="Edit Data">
                                        <i class="bi bi-pencil"></i>
                                    </a>
                                    <button type="button" class="btn-action btn-delete btn-delete-trigger" data-id="{{ $p->id }}" data-bs-toggle="tooltip" title="Hapus Data">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                    <form id="delete-form-{{ $p->id }}" action="{{ route('pensiun.destroy', $p->id) }}" method="POST" style="display: none;">
                                        @csrf
                                        @method('DELETE')
                                    </form>
                                </div>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
            @else
            <div class="empty-state">
                <i class="bi bi-folder2-open"></i>
                <h5>Belum ada data pensiun</h5>
                <p>Belum ada data pensiun yang tersedia. Klik tombol di bawah untuk menambahkan data.</p>
                <button type="button" class="btn btn-primary-custom" data-bs-toggle="modal" data-bs-target="#pensiunModal">
                    <i class="bi bi-plus-lg me-2"></i>Tambah Data Pensiun
                </button>
            </div>
            @endif
        </div>
    </div>
</div>

<!-- Modal Tambah Data Pensiun -->
<div class="modal fade" id="pensiunModal" tabindex="-1" aria-labelledby="pensiunModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="pensiunModalLabel">Input Data Pensiun</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="pensiunForm" method="POST" action="{{ route('pensiun.store') }}" enctype="multipart/form-data">
                    @csrf
                    
                    <div class="form-group row mb-3">
                        <label for="nip" class="col-md-3 col-form-label">NIP</label>
                        <div class="col-md-9">
                            <select class="form-select select2" id="nip" name="nip" required>
                                <option value="">-- Pilih NIP --</option>
                            </select>
                            <div class="invalid-feedback">NIP harus dipilih</div>
                        </div>
                    </div>
                    
                    <div class="form-group row mb-3">
                        <label for="nama" class="col-md-3 col-form-label">Nama</label>
                        <div class="col-md-9">
                            <input type="text" class="form-control" id="nama" readonly>
                        </div>
                    </div>
                    
                    <div class="form-group row mb-3">
                        <label for="tmt_pensiun" class="col-md-3 col-form-label">TMT Pensiun</label>
                        <div class="col-md-9">
                            <input type="date" class="form-control" id="tmt_pensiun" name="tmt_pensiun" readonly>
                        </div>
                    </div>
                    
                    <div class="form-group row mb-3">
                        <label for="tempat_tugas" class="col-md-3 col-form-label">Tempat Tugas</label>
                        <div class="col-md-9">
                            <input type="text" class="form-control" id="tempat_tugas" name="tempat_tugas" required>
                            <div class="invalid-feedback">Tempat tugas harus diisi</div>
                        </div>
                    </div>
                    
                    <div class="form-group row mb-3">
                        <label for="jenis_pensiun" class="col-md-3 col-form-label">Jenis Pensiun</label>
                        <div class="col-md-9">
                            <select class="form-select" id="jenis_pensiun" name="jenis_pensiun" required>
                                <option value="">-- Pilih Jenis Pensiun --</option>
                                <option value="BUP">BUP</option>
                                <option value="APS">APS</option>
                                <option value="Janda/Duda">Janda/Duda</option>
                                <option value="Pensiun Dini">Pensiun Dini</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                            <div class="invalid-feedback">Jenis pensiun harus dipilih</div>
                        </div>
                    </div>
                    
                    <div class="form-group row mb-3">
                        <label for="status" class="col-md-3 col-form-label">Status</label>
                        <div class="col-md-9">
                            <select class="form-select" id="status" name="status" required>
                                <option value="">-- Pilih Status --</option>
                                <option value="Diajukan">Diajukan</option>
                                <option value="Diproses">Diproses</option>
                                <option value="Disetujui">Disetujui</option>
                                <option value="Ditolak">Ditolak</option>
                            </select>
                            <div class="invalid-feedback">Status harus dipilih</div>
                        </div>
                    </div>
                    
                    <div id="fileUploadSection" class="form-group row mb-3" style="display: none;">
                        <label for="file_sk" class="col-md-3 col-form-label">Upload SK Pensiun</label>
                        <div class="col-md-9">
                            <div class="input-group">
                                <input type="file" class="form-control" id="file_sk" name="file_sk" accept=".pdf,.jpg,.jpeg,.png">
                                <button type="button" id="previewBtn" class="btn btn-outline-primary-custom" data-bs-toggle="modal" data-bs-target="#previewModal" style="display: none;">
                                    <i class="bi bi-eye"></i>
                                </button>
                            </div>
                            <div class="invalid-feedback">File SK harus diunggah</div>
                            <small class="form-text text-muted">Format yang diperbolehkan: PDF, JPG, JPEG, PNG (Maks. 2MB)</small>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                    <i class="bi bi-x-circle me-1"></i> Batal
                </button>
                <button type="button" id="submitPensiunForm" class="btn btn-primary-custom">
                    <i class="bi bi-save me-1"></i> Simpan Data
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Preview Modal -->
<div class="modal fade" id="previewModal" tabindex="-1" aria-labelledby="previewModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="previewModalLabel">Preview Dokumen</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div id="previewContent" class="text-center">
                    <!-- Preview will be displayed here -->
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
            </div>
        </div>
    </div>
</div>
@endsection

@section('scripts')
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/1.13.6/js/dataTables.bootstrap5.min.js"></script>
<script src="https://cdn.datatables.net/responsive/2.4.1/js/dataTables.responsive.min.js"></script>
<script src="https://cdn.datatables.net/responsive/2.4.1/js/responsive.bootstrap5.min.js"></script>
<script src="https://cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
<script src="https://cdn.datatables.net/buttons/2.4.1/js/buttons.bootstrap5.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>
<script src="https://cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js"></script>
<script src="https://cdn.datatables.net/buttons/2.4.1/js/buttons.print.min.js"></script>
<script src="https://cdn.datatables.net/buttons/2.4.1/js/buttons.colVis.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<script>
$(document).ready(function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
    
    // Initialize DataTable
    var table = $('#pensiun-table').DataTable({
        responsive: true,
        lengthMenu: [5, 10, 25, 50],
        pageLength: 10,
        dom: '<"d-flex justify-content-between align-items-center mb-3"lBf>rt<"d-flex justify-content-between align-items-center mt-3"ip>',
        buttons: [
            {
                extend: 'excel',
                text: '<i class="bi bi-file-earmark-excel me-1"></i> Excel',
                className: 'btn btn-sm btn-outline-primary-custom',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5]
                }
            },
            {
                extend: 'pdf',
                text: '<i class="bi bi-file-earmark-pdf me-1"></i> PDF',
                className: 'btn btn-sm btn-outline-primary-custom',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5]
                }
            },
            {
                extend: 'print',
                text: '<i class="bi bi-printer me-1"></i> Print',
                className: 'btn btn-sm btn-outline-primary-custom',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5]
                }
            }
        ],
        language: {
            search: "_INPUT_",
            searchPlaceholder: "Cari...",
            lengthMenu: "_MENU_ data per halaman",
            zeroRecords: "Tidak ada data yang ditemukan",
            info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
            infoEmpty: "Tidak ada data yang tersedia",
            infoFiltered: "(difilter dari _MAX_ total data)",
            paginate: {
                first: '<i class="bi bi-chevron-double-left"></i>',
                last: '<i class="bi bi-chevron-double-right"></i>',
                previous: '<i class="bi bi-chevron-left"></i>',
                next: '<i class="bi bi-chevron-right"></i>'
            }
        }
    });
    
    // Customize DataTable search field
    $('.dataTables_filter input').addClass('form-control form-control-sm');
    $('.dataTables_filter input').attr('placeholder', 'Cari...');
    $('.dataTables_filter').addClass('mb-2');
    $('.dataTables_length select').addClass('form-select form-select-sm');
    
    // Initialize Select2 for NIP dropdown with modal-specific settings
    $('#pensiunModal').on('shown.bs.modal', function() {
        // Initialize Select2 for NIP dropdown
        $('.select2').select2({
            theme: 'bootstrap-5',
            dropdownParent: $('#pensiunModal'),
            placeholder: "Cari NIP pegawai...",
            allowClear: true,
            ajax: {
                url: "{{ route('pegawai.search') }}",
                dataType: 'json',
                delay: 250,
                data: function(params) {
                    return {
                        q: params.term,
                        page: params.page || 1
                    };
                },
                processResults: function(data, params) {
                    params.page = params.page || 1;
                    return {
                        results: data.items,
                        pagination: {
                            more: (params.page * 10) < data.total_count
                        }
                    };
                },
                cache: true
            },
            minimumInputLength: 3,
            templateResult: formatPegawai,
            templateSelection: formatPegawaiSelection
        });
    });
    
    // Format the result in dropdown
    function formatPegawai(pegawai) {
        if (pegawai.loading) {
            return pegawai.text;
        }
        
        var $container = $(
            '<div class="select2-result-pegawai d-flex flex-column">' +
                '<div class="select2-result-pegawai__name font-weight-bold">' + pegawai.text + '</div>' +
                '<div class="select2-result-pegawai__nip text-muted small">' + pegawai.id + '</div>' +
            '</div>'
        );
        
        return $container;
    }
    
    // Format the selected option
    function formatPegawaiSelection(pegawai) {
        return pegawai.id ? pegawai.id + ' - ' + pegawai.text : pegawai.text;
    }

    // When NIP is selected, fetch employee data
    $('#nip').on('change', function() {
        var nip = $(this).val();
        if (nip) {
            $.ajax({
                url: "{{ route('pegawai.get-by-nip') }}",
                type: "GET",
                data: { nip: nip },
                dataType: "json",
                success: function(data) {
                    $('#nama').val(data.nama);
                    $('#tmt_pensiun').val(data.tmt_pensiun);
                },
                error: function() {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Gagal mengambil data pegawai!',
                        customClass: {
                            confirmButton: 'btn btn-primary-custom'
                        }
                    });
                }
            });
        } else {
            $('#nama').val('');
            $('#tmt_pensiun').val('');
        }
    });

    // Show/hide file upload section based on status selection
    $('#status').on('change', function() {
        if ($(this).val() === 'Disetujui') {
            $('#fileUploadSection').slideDown();
            $('#file_sk').prop('required', true);
        } else {
            $('#fileUploadSection').slideUp();
            $('#file_sk').prop('required', false);
        }
    });
    
    // Show/hide preview button based on file selection
    $('#file_sk').on('change', function() {
        if ($(this).val()) {
            // File selected, show preview button
            $('#previewBtn').show();
        } else {
            // No file selected, hide preview button
            $('#previewBtn').hide();
        }
    });

    // Handle document preview
    var closedForPreview = false;
    
    $('#previewBtn').on('click', function() {
        // Store the current modal state
        closedForPreview = true;
        $('#pensiunModal').modal('hide');
        
        var file = $('#file_sk').prop('files')[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var fileType = file.type;
                var previewContent = '';
                
                if (fileType.includes('pdf')) {
                    previewContent = '<iframe src="' + e.target.result + '" width="100%" height="500px"></iframe>';
                } else if (fileType.includes('image')) {
                    previewContent = '<img src="' + e.target.result + '" class="img-fluid" alt="Preview">';
                } else {
                    previewContent = '<p>Format file tidak dapat ditampilkan</p>';
                }
                
                $('#previewContent').html(previewContent);
            };
            reader.readAsDataURL(file);
        } else {
            $('#previewContent').html('<p>Tidak ada file yang dipilih</p>');
        }
    });

    // Return to form modal when preview modal is closed
    $('#previewModal').on('hidden.bs.modal', function() {
        $('#pensiunModal').modal('show');
    });

    // Form submission
    $('#submitPensiunForm').on('click', function() {
        var form = $('#pensiunForm');
        form.addClass('was-validated');
        
        if (form[0].checkValidity() === false) {
            Swal.fire({
                icon: 'error',
                title: 'Validasi Error',
                text: 'Silakan periksa kembali form isian Anda!',
                customClass: {
                    confirmButton: 'btn btn-primary-custom'
                }
            });
            return false;
        }
        
        // If validation passes, show confirmation and submit
        Swal.fire({
            title: 'Konfirmasi',
            text: "Apakah Anda yakin akan menyimpan data pensiun ini?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#8B5CF6',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Ya, Simpan!',
            cancelButtonText: 'Batal',
            customClass: {
                confirmButton: 'btn btn-primary-custom',
                cancelButton: 'btn btn-secondary'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Submit the form
                form.submit();
            }
        });
    });

    // Reset form when modal is closed (but not when switching to preview)
    $('#pensiunModal').on('hidden.bs.modal', function(e) {
        // Only reset if not being closed for preview
        if (!closedForPreview) {
            $('#pensiunForm')[0].reset();
            $('#pensiunForm').removeClass('was-validated');
            $('#fileUploadSection').hide();
            $('#file_sk').prop('required', false);
            
            // Clear Select2
            if ($('#nip').data('select2')) {
                $('#nip').val('').trigger('change');
            }
            
            $('#nama').val('');
            $('#tmt_pensiun').val('');
            $('#previewBtn').hide();
        }
        
        // Reset the flag after handling
        closedForPreview = false;
    });
    
    // Handle delete button
    $('.btn-delete-trigger').on('click', function() {
        var id = $(this).data('id');
        
        Swal.fire({
            title: 'Konfirmasi Hapus',
            text: "Apakah Anda yakin ingin menghapus data ini?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
            customClass: {
                confirmButton: 'btn btn-danger',
                cancelButton: 'btn btn-secondary'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                document.getElementById('delete-form-' + id).submit();
            }
        });
    });
    
    // Refresh button
    $('#refreshData').on('click', function() {
        // Show loading indicator
        Swal.fire({
            title: 'Memuat Data...',
            html: 'Mohon tunggu sebentar',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            }
        });
        
        // Reload the page
        location.reload();
    });
});
</script>
@endsection
